/* eslint-disable import/no-named-as-default */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import _ from 'lodash';
import { MY_HOST } from '../../my-config';
import ProductCard from './Components/ProductCard';

function Store() {
  const categories = [
    { name: 'ALL' },
    { name: 'DOG' },
    { name: 'CAT' },
  ];
  const [productData, setProductData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentCate, setCurrentCate] = useState('ALL');
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState(12);
  const [totalAmount, setTotalAmount] = useState(0);

  const getProductData = async () => {
    try {
      const res = await axios.get(`${MY_HOST}/product/api/data?amount=${amount}${currentCate !== 'ALL' ? currentCate === 'DOG' ? '&cate=1' : '&cate=2' : ''}`);

      // console.log(res.data);
      const data = res.data.rows;
      const total = res.data.num;
      // console.log(data);
      // console.log(total[0]);
      // const products = _.chunk(data, 6);
      setProductData(data);
      setTotalAmount(total[0].pro_amount);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);
  useEffect(() => {
    getProductData();
  }, [amount, currentCate]);

  return (
    <div className="w-full h-full">
      <ul className="flex justify-around mt-8">
        {categories.map((cate) => (<li role="presentation" key={cate.name} className={currentCate === cate.name ? ' text-orange-500 font-bold' : ''} onClick={() => setCurrentCate(`${cate.name}`)}>{cate.name}</li>))}
      </ul>
      <div className="container flex flex-wrap my-5 md:mx-auto">
        {productData.length > 0
          // eslint-disable-next-line max-len
          && productData.map((e) => (<ProductCard key={e.sid} name={e.name} price={e.member_price} img={e.img} sid={e.sid} />))}
        {totalAmount > 0 && amount >= totalAmount ? (
          <div className="hidden btn-group mx-auto mt-5">
            <button type="button" className="rounded-2xl p-3 btn-primary" onClick={() => setAmount(amount + 6)}>SHOW MORE</button>
          </div>
        ) : (
          <div className="btn-group mx-auto mt-5">
            <button type="button" className="rounded-2xl p-3 btn-primary" onClick={() => setAmount(amount + 6)}>SHOW MORE</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Store;
