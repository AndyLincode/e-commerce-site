/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addCart, reduceCart, removeItem } from '../../model/cartSlice';
import { MY_HOST } from '../../my-config';

export default function Cart() {
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const param = useLocation();
  // console.log(param.pathname);
  const [currentParam, setCurrentParam] = useState(param.pathname);

  const handleAddSingle = (e) => {
    const {
      sid, name, img, price,
    } = e;
    const amount = 1;
    dispatch(addCart({
      sid, name, img, price, amount,
    }));
  };
  const handleReduceSingle = (e) => {
    const { sid } = e;
    dispatch(reduceCart({ sid }));
  };

  const handleRemove = (e) => {
    const { sid } = e;
    dispatch(removeItem({ sid }));
  };

  const totalPrice = state.cart.map((e) => e.price * e.amount);
  const price = totalPrice.reduce((acc, cur) => acc + cur);

  return (
    <div className=" h-screen">
      <div className="cartProgressBar my-8 w-[80%] flex mx-auto">
        <div className="progress flex h-full p-2 items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="progressSvg"><i className={currentParam === '/cart' ? 'fa-light fa-ballot-check text-[#40220f]' : 'fa-light fa-ballot-check'} /></div>
            <div className="progressText"><p className={currentParam === '/cart' ? 'text-xs text-[#40220f]' : 'fa-light fa-ballot-check'}>確認訂單</p></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg"><i className="fa-regular fa-credit-card" /></div>
            <div className="progressText"><p className=" text-xs">確認付款</p></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg"><i className="fa-regular fa-file-check" /></div>
            <div className="progressText"><p className=" text-xs">完成訂單</p></div>
          </div>
        </div>
      </div>
      <div className="cartItem flex flex-col w-[90%] mx-auto">
        {state.cart.map((e, i) => (
          <div className="productLine relative bg-white flex w-full justify-around" key={e.sid}>
            <div className="imageWrap w-20 h-20 rounded-md ">
              <img src={`${MY_HOST}/images/${e.img}`} alt={e.name} />
            </div>
            <div className="titleWrap flex mt-3 ml-2">
              <p className=" text-sm">{e.name}</p>
            </div>
            <div className="amountWrap flex justify-around items-center">
              <div role="presentation" onClick={() => handleReduceSingle(e)}><i className="fa-regular fa-minus text-xs" /></div>
              <input className="w-4 h-3 bg-white text-black text-sm mx-2" type="number" value={e.amount} readOnly disabled />
              <div role="presentation" onClick={() => handleAddSingle(e)}><i className="fa-regular fa-plus text-xs" /></div>
            </div>
            <div role="presentation" className="delItem absolute right-1 top-[-4px] cursor-pointer text-red-500" onClick={() => handleRemove(e)}><i className="fa-light fa-trash text-xs" /></div>
          </div>
        ))}
      </div>
      <div className="totalPrice w-full flex justify-end pr-5 mt-3">
        <p className="text-black">
          金額：
          <span className="ml-2 text-red-600">{price}</span>
        </p>
      </div>
    </div>
  );
}
