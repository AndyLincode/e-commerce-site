/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const db = require(`${__dirname}/../modules/db_connect`);

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

router.post('/createOrders', async (req, res) => {
  const data = await createOrders(req);

  res.json(data);
});

router.get('/orderDetails', async (req, res) => {
  const data = await getOrderDetails(req);
  res.json(data);
});

module.exports = router;
