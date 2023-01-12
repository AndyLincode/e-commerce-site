/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const db = require(`${__dirname}/../modules/db_connect`);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/login_api', async (req, res) => {
  const output = {
    success: false,
    error: '',
    postData: req.body, // 除錯,看資料用
    auth: {},
  };

  const sql = 'SELECT * FROM members_data WHERE email=?';
  let row = [];
  row = await db.query(sql, [req.body.mail]);
  const pass = req.body.password;
  if (row[0][0]) {
    // console.log(row);
    // console.log(row[0][0]);
    output.success = await bcrypt.compare(pass, row[0][0].password);
  } else {
    output.error = '帳號或密碼錯誤';
  }

  if (output.success) {
    const { sid, name, email } = row[0][0];
    const token = jwt.sign({ sid, name, email }, process.env.JWT_SECRET);

    output.auth = {
      sid,
      name,
      token,
      login: true,
    };
  } else {
    // eslint-disable-next-line no-console
    console.log(output);
  }

  res.json(output);
});

// eslint-disable-next-line consistent-return
router.post('/add', async (req, res) => {
  const output = {
    success: false,
    error: '',
    postData: req.body, // 除錯,看資料用
  };
  const { mail, password, name } = req.body.userData;
  const cSql = 'SELECT * FROM members_data WHERE email=?';
  let cRow = [];
  cRow = await db.query(cSql, mail);
  if (cRow[0].length > 0) {
    output.error = '重複帳號';
    // console.log(cRow[0]);
    return res.json(output);
  }

  const sql = 'INSERT INTO members_data(name, password, email) VALUES (?,?,?)';
  let row = [];
  const hash = await bcrypt.hash(password, 5);
  row = await db.query(sql, [name, hash, mail]);
  if (row[0].affectedRows) {
    output.success = true;
  } else {
    output.error = '帳號或密碼錯誤';
  }
  res.json(output);
});

module.exports = router;
