/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const db = require(`${__dirname}/../modules/db_connect`);

// functions
// 取得商品資料
// eslint-disable-next-line no-unused-vars
const getProductData = async (req, res) => {
  let where = '';
  const amounts = +req.query.amount;
  const cate = +req.query.cate || 0;
  if (cate === 1) {
    where = 'WHERE category = 3 OR category = 5 OR category = 7 OR category = 8 OR category = 9 OR category = 10 ';
  } else if (cate === 2) {
    where = 'WHERE category = 11 OR category = 13 OR category = 15 OR category = 16 OR category = 17 OR category = 18 ';
  } else {
    where = 'WHERE 1 ';
  }

  let rows = [];
  const sql = `SELECT * FROM products ${where} LIMIT ${amounts}`;

  [rows] = await db.query(sql);

  let num = [];
  const nSql = `SELECT COUNT(1) pro_amount FROM products ${where}`;

  [num] = await db.query(nSql);

  return { rows, num };
};

// 商品資料
router.get('/api/data', async (req, res) => {
  const data = await getProductData(req);

  res.json(data);
});

module.exports = router;
