/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const db = require(`${__dirname}/../modules/db_connect`);

// functions
// 取得商品資料
// eslint-disable-next-line no-unused-vars
const getProductData = async (req, res) => {
  const amounts = +req.query.amount;

  let rows = [];
  const sql = `SELECT * FROM products WHERE 1 LIMIT ${amounts}`;

  [rows] = await db.query(sql);

  let num = [];
  const nSql = 'SELECT COUNT(1) pro_amount FROM products WHERE 1';

  [num] = await db.query(nSql);

  return { rows, num };
};

// 商品資料
router.get('/api/data', async (req, res) => {
  const data = await getProductData(req);

  res.json(data);
});

module.exports = router;
