/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { MY_HOST } from '../../../my-config';

export default function ProductCard({ name, price, img }) {
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState(0);
  function formatPrice(priceInfo) {
    const parts = priceInfo.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  return (
    <div className="w-1/2">
      <div className="imageWrap">
        <img src={`${MY_HOST}/images/${img}`} alt={`${name}`} />
      </div>
      <div className="productInfo text-center">
        <h1>{name}</h1>
        <span className="text-red-600">{`$${formatPrice(price)}`}</span>
        <input type="number" defaultValue={0} className=" p-[2px] ml-3 w-8 rounded bg-slate-50 outline-yellow-500 border-none outline-1" onChange={(e) => setAmount(e.target.value)} />
        <span><i className="fa-sharp fa-solid fa-cart-shopping ml-3 cursor-pointer" /></span>
      </div>
    </div>
  );
}
