/* eslint-disable import/no-dynamic-require */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.post(multer().none(), async (req, res, next) => {
  next();
});

app.get('/', (req, res) => {
  res.json('<h2>首頁</h2>');
});

// 商品路由
const productRouter = require(`${__dirname}/routes/product`);
app.use('/product', productRouter);
// 購物車路由
const cartRouter = require(`${__dirname}/routes/cart`);
app.use('/cart', cartRouter);
// 會員路由
const memberRouter = require(`${__dirname}/routes/member`);
app.use('/member', memberRouter);

// 靜態資料夾
app.use(express.static('public'));

// 404 page
app.use((req, res) => {
  res.status(404).send('Error! NOT FOUND');
});

const port = process.env.SERVER_PORT || 6011;
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server start! port:${port}`));
