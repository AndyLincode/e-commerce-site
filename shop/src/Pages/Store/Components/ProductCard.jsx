/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// redux
import { useDispatch } from 'react-redux';
import { addCart } from '../../../model/cartSlice';
import { MY_HOST } from '../../../my-config';

// eslint-disable-next-line no-unused-vars
const MySwal = withReactContent(Swal);

export default function ProductCard({
  name, price, img, sid,
}) {
  // variable
  const dispatch = useDispatch();

  // state
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState(0);

  // some functions
  function formatPrice(priceInfo) {
    const parts = priceInfo.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  const handleAddCart = () => {
    if (amount <= 0) {
      MySwal.fire({
        title: <strong>請輸入數量</strong>,
        icon: 'error',
      });
      return;
    }
    dispatch(addCart({
      sid, name, img, price, amount,
    }));
    MySwal.fire({
      title: <strong>成功加入購物車</strong>,
      icon: 'success',
    });
  };

  // render
  return (
    <div className="w-1/2">
      <div className="imageWrap">
        <img src={`${MY_HOST}/images/${img}`} alt={`${name}`} />
      </div>
      <div className="productInfo text-center">
        <h1>{name}</h1>
        <span className="text-red-600">{`$${formatPrice(price)}`}</span>
        <input type="number" defaultValue={0} className=" p-[2px] ml-3 w-8 rounded bg-slate-50 outline-yellow-500 border-none outline-1" onChange={(e) => setAmount(+e.target.value)} />
        <span><span role="presentation" className="fa-sharp fa-solid fa-cart-shopping ml-3 cursor-pointer" onClick={handleAddCart} /></span>
      </div>
    </div>
  );
}
