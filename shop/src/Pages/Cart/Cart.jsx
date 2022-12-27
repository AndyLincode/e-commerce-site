/* eslint-disable no-unused-vars */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, reduceCart } from '../../model/cartSlice';
import { MY_HOST } from '../../my-config';

export default function Cart() {
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state.cart);
  const dispatch = useDispatch();

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

  return (
    <div className=" h-screen">
      <div className="cartProgressBar h-5 my-8">
        流程圖
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
            <div className="delItem absolute right-1 top-[-4px] cursor-pointer text-red-500"><i className="fa-light fa-trash text-xs" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
