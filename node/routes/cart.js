/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */
const { default: axios } = require('axios');
const { HmacSHA256 } = require('crypto-js');
const Base64 = require('crypto-js/enc-base64');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const router = express.Router();
const db = require(`${__dirname}/../modules/db_connect`);

const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_VERSION,
  LINEPAY_SITE,
  LINEPAY_CHANNEL_SECRET_KEY,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL,
} = process.env;

// eslint-disable-next-line object-curly-newline
let orders = {
  amount: 0,
  currency: 'TWD',
  orderId: '',
  packages: [
    {
      id: '1',
      amount: 0,
      products: [],
    },
  ],
};

function createSignature(uri, linePayBody) {
  // eslint-disable-next-line radix
  const nonce = parseInt(new Date().getTime() / 1000);
  const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(
    linePayBody
  )}${nonce}`;
  // console.log(linePayBody);
  const signature = Base64.stringify(
    HmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY)
  );
  const headers = {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': signature,
  };
  return headers;
}

const getCartData = async (req, res) => {
  const cartItem = req.body;
  const rows = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < req.body.length; i++) {
    const sql = 'SELECT p.member_price FROM products p WHERE p.sid=?';

    // eslint-disable-next-line no-await-in-loop, camelcase
    const data = await db.query(sql, cartItem[i].sid);
    rows.push(+data[0][0].member_price * +cartItem[i].amount);
    // console.log(data[0][0].member_price * cartItem[i].amount);
  }
  return { rows };
};

const createOrders = async (req, res) => {
  const output = {
    success: false,
    error: '',
    postData: req.body, // 除錯,看資料用
    auth: {},
  };
  const products = req.body.orders;
  const sid = req.body.sid;
  const payWay = req.body.payWay;
  const orderId = uuidv4();
  let totalPrice = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < products.length; i++) {
    // console.log(request[i].sid);
    const pSql = `SELECT member_price FROM products WHERE sid = ${products[i].sid}`;
    const oSql =
      'INSERT INTO order_details(orders_num, product_sid, amount, subtotal) VALUES (?,?,?,?)';
    // eslint-disable-next-line no-await-in-loop
    const result = await db.query(pSql);
    // eslint-disable-next-line no-await-in-loop
    const detailsResult = await db.query(oSql, [
      orderId,
      products[i].sid,
      products[i].amount,
      +result[0][0].member_price * +products[i].amount,
    ]);
    // console.log(result[0][0].member_price);
    totalPrice += +result[0][0].member_price * products[i].amount;

    // for LinePay
    if (payWay === 'LINEPAY') {
      orders.packages[0].products.push({
        name: products[i].name,
        price: +result[0][0].member_price,
        quantity: products[i].amount,
      });
    }
  }
  if (payWay === 'LINEPAY') {
    orders.packages[0].amount = totalPrice;
    orders.amount = totalPrice;
    orders.currency = 'TWD';
    orders.orderId = orderId;
    const linePayBody = {
      ...orders,
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}/${LINEPAY_RETURN_CONFIRM_URL}?od_sid=${orderId}`,
        cancelUrl: `${LINEPAY_RETURN_HOST}/${LINEPAY_RETURN_CANCEL_URL}`,
      },
    };
    const uri = '/payments/request';
    // eslint-disable-next-line radix
    const headers = createSignature(uri, linePayBody);
    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    try {
      const linePayRes = await axios.post(url, linePayBody, { headers });
      // console.log({ url, linePayBody: JSON.stringify(linePayBody), headers });
      // console.log(linePayRes);
      if (linePayRes?.data?.returnCode === '0000') {
        // res.json(linePayRes?.data?.info.paymentUrl.web);
        // eslint-disable-next-line max-len, quotes
        const sql =
          'INSERT INTO orders(orders_num, member_sid, total_price, pay_way, ordered_at) VALUES ( ?,?,?,?,NOW())';
        const [result2] = await db.query(sql, [
          orderId,
          sid,
          totalPrice,
          payWay,
        ]);

        // console.log(result2.affectedRows);
        if (result2.affectedRows) {
          output.success = true;
        }
      }
      return { orderId, data: linePayRes };
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line max-len, quotes
  const sql =
    'INSERT INTO orders(orders_num, member_sid, total_price, pay_way, ordered_at) VALUES ( ?,?,?,?,NOW())';
  const [result2] = await db.query(sql, [orderId, sid, totalPrice, payWay]);

  // console.log(result2.affectedRows);
  if (result2.affectedRows) {
    output.success = true;
  }

  return { output, orderId };
};

const getOrderDetails = async (req, res) => {
  const orderId = req.query.orderId;
  // console.log(orderId);
  const sql = `SELECT * FROM orders WHERE orders_num='${orderId}'`;
  let rows = [];

  [rows] = await db.query(sql);

  return { rows };
};

router.post('/cartData', async (req, res) => {
  const { rows } = await getCartData(req);

  res.json(rows);
});

router.post('/createOrders', async (req, res) => {
  const data = await createOrders(req, res);

  res.json(data);
});

router.post('/linepay', async (req, res) => {
  const { data } = await createOrders(req, res);
  orders = {
    amount: 0,
    currency: 'TWD',
    orderId: '',
    packages: [
      {
        id: '1',
        amount: 0,
        products: [],
      },
    ],
  };
  res.json(data?.data?.info.paymentUrl.web);
});

router.get('/orderDetails', async (req, res) => {
  const data = await getOrderDetails(req);
  res.json(data);
});

router.get('/linepay/confirm', async (req, res) => {
  const { transactionId, orderId } = req.query;
  try {
    const order = orders[orderId];

    const linePayBody = {
      amount: order.amount,
      currency: 'TWD',
    };

    const uri = `/payments/${transactionId}/confirm`;

    const headers = createSignature(uri, linePayBody);

    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    const linePayRes = await axios.post(url, linePayBody, { headers });

    res.json(linePayRes.data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
