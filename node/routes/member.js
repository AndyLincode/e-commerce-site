/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const db = require(`${__dirname}/../modules/db_connect`);
const jwt = require('jsonwebtoken');

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
  if (row[0][0]) {
    // console.log(row);
    // console.log(row[0][0]);
    output.success = req.body.password === row[0][0].password;
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

module.exports = router;
