/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { addCart, reduceCart, removeItem } from '../../model/cartSlice';
import { MY_HOST } from '../../my-config';

const MySwal = withReactContent(Swal);

export default function CartDemo() {
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state.cart);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const param = useLocation();
  const navigate = useNavigate();
  // console.log(param.pathname);
  const [currentParam, setCurrentParam] = useState(param.pathname);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddSingle = (e) => {
    const { sid, name, img, price } = e;
    const amount = 1;
    dispatch(
      addCart({
        sid,
        name,
        img,
        price,
        amount,
      })
    );
  };
  const handleReduceSingle = (e) => {
    const { sid } = e;
    dispatch(reduceCart({ sid }));
  };

  const handleRemove = (e) => {
    const { sid } = e;
    dispatch(removeItem({ sid }));
  };

  const handleSubmit = () => {
    if (userState.profile.login) {
      if (state.cart.length > 0) {
        navigate('/cart');
      }
    } else {
      MySwal.fire({
        title: <strong>請先登入會員</strong>,
        icon: 'warning',
      });
      navigate('/login');
    }
  };

  const getCartData = async () => {
    if (state.cart.length > 0) {
      const orders = state.cart.map((e) => {
        return { sid: e.sid, amount: e.amount };
      });
      try {
        const res = await axios.post(`${MY_HOST}/cart/cartData`, orders);
        setTotalPrice(res.data.reduce((acc, cur) => acc + cur, 0));
      } catch (err) {
        console.log(err);
      }
    }
  };
  // const totalPrice = state.cart.map((e) => e.price * e.amount);
  // const price =
  //   state.cart.length > 0 ? totalPrice.reduce((acc, cur) => acc + cur) : 0;

  useEffect(() => {
    getCartData();
  }, []);
  useEffect(() => {
    getCartData();
  }, [state]);

  return (
    <div className=" h-screen">
      <div className="cartProgressBar my-8 w-[80%] flex mx-auto">
        <div className="progress flex h-full p-2 items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="progressSvg">
              <i
                className={`fa-light fa-ballot-check ${
                  currentParam === '/check' ? 'text-[#40220f]' : ''
                }`}
              />
            </div>
            <div className="progressText">
              <p
                className={`text-xs ${
                  currentParam === '/check' ? 'text-[#40220f]' : ''
                }`}
              >
                確認訂單
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg">
              <i className="fa-regular fa-credit-card" />
            </div>
            <div className="progressText">
              <p className=" text-xs">確認付款</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg">
              <i className="fa-regular fa-file-check" />
            </div>
            <div className="progressText">
              <p className=" text-xs">完成訂單</p>
            </div>
          </div>
        </div>
      </div>
      <div className="cartItem flex flex-col w-[90%] mx-auto">
        {state.cart.map((e, i) => (
          <div
            className="productLine relative bg-white flex w-full justify-around"
            key={e.sid}
          >
            <div className="imageWrap w-20 h-20 rounded-md ">
              <img src={`${MY_HOST}/images/${e.img}`} alt={e.name} />
            </div>
            <div className="titleWrap flex mt-3 ml-2">
              <p className=" text-sm">{e.name}</p>
            </div>
            <div className="amountWrap flex justify-around items-center">
              <div role="presentation" onClick={() => handleReduceSingle(e)}>
                <i className="fa-regular fa-minus text-xs" />
              </div>
              <input
                className="w-4 h-3 bg-white text-black text-sm mx-2"
                type="number"
                value={e.amount}
                readOnly
                disabled
              />
              <div role="presentation" onClick={() => handleAddSingle(e)}>
                <i className="fa-regular fa-plus text-xs" />
              </div>
            </div>
            <div
              role="presentation"
              className="delItem absolute right-1 top-[-4px] cursor-pointer text-red-500"
              onClick={() => handleRemove(e)}
            >
              <i className="fa-light fa-trash text-xs" />
            </div>
          </div>
        ))}
      </div>
      <div className="totalPrice w-full flex justify-end pr-5 mt-3">
        <p className="text-black">
          金額：
          <span className="ml-2 text-red-600">{totalPrice}</span>
        </p>
      </div>
      <div className="submitBtn flex justify-end mr-4 mt-4">
        <button
          className={`btn btn-primary text-lg ${
            state.cart.length <= 0 ? 'btn-disabled text-stone-600' : ''
          }`}
          onClick={() => {
            handleSubmit();
          }}
        >
          確認訂單
        </button>
      </div>
    </div>
  );
}
