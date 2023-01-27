/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { clearItem } from '../../model/cartSlice';
import { MY_HOST } from '../../my-config';


const MySwal = withReactContent(Swal);

export default function Cart() {
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state.cart);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const param = useLocation();
  const navigate = useNavigate();
  const [payWay, setPayWay] = useState('CASH');
  const [totalPrice, setTotalPrice] = useState(0);

  // 流程圖狀態用
  const [currentParam, setCurrentParam] = useState(param.pathname);

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

  const handleSubmit = async (payWay) => {
    if (userState.profile?.login) {
      if (state.cart.length > 0) {
        const orders = state.cart.map((e) => { return { sid: e.sid, name: e.name, amount: e.amount } });
        const sid = userState.profile.sid;
        try {
          const res = await axios.post(`${MY_HOST}/cart/${payWay === 'LINEPAY' ? 'linepay' : 'createOrders'}`, { orders, sid, payWay })
          // console.log(res);
          if (res.data.output?.success) {
            MySwal.fire({
              title: <strong>成功送出訂單</strong>,
              icon: 'success'
            })
            navigate(`/success?od_sid=${res.data.orderId}`);
            dispatch(clearItem());
          } else {
            window.open(res.data, '_self');
            dispatch(clearItem());
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      MySwal.fire({
        title: <strong>請先登入會員</strong>,
        icon: 'warning'
      })
      navigate('/login');
    }
  }

  useEffect(() => {
    getCartData();
  }, [])

  return (
    <div className=" h-screen">
      <div className="cartProgressBar my-8 w-[80%] flex mx-auto">
        <div className="progress flex h-full p-2 items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="progressSvg"><i className='fa-light fa-ballot-check' /></div>
            <div className="progressText"><p className='text-xs'>確認訂單</p></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg"><i className={`fa-regular fa-credit-card ${currentParam === '/cart' ? 'text-[#40220f]' : ''}`} /></div>
            <div className="progressText"><p className={`text-xs ${currentParam === '/cart' ? 'text-[#40220f]' : ''}`}>確認付款</p></div>
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
              <input className="w-4 h-3 bg-white text-black text-sm mx-2" type="number" value={e.amount} readOnly disabled />
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
      <div className='payMethod ml-5 w-[30%] absolute'>
        <div onClick={() => setPayWay('CASH')} className={` m-3 border-2 rounded-lg text-center cursor-pointer ${payWay === 'CASH' ? 'border-yellow-400 bg-yellow-400' : 'border-slate-500 bg-slate-500'}`}><p className='text-white'>CASH</p></div>
        <div onClick={() => setPayWay('LINEPAY')} className={` m-3 border-2 rounded-lg text-center cursor-pointer ${payWay === 'LINEPAY' ? 'border-green-400 bg-green-400' : 'border-slate-500 bg-slate-500'}`}><p className='text-white'>LINEPAY</p></div>
      </div>
      <div className='editBtn flex justify-end mr-4 my-4'>
        <button className='text-white btn btn-error' onClick={() => {
          navigate('/check')
        }}>返回修改</button>
      </div>
      <div className='submitBtn flex justify-end mr-4 mt-4'>
        <button className={`btn btn-primary text-lg ${state.cart.length <= 0 ? 'btn-disabled text-stone-600' : ''}`} onClick={() => {
          handleSubmit(payWay)
        }}>送出訂單</button>
      </div>
    </div>
  );
}
