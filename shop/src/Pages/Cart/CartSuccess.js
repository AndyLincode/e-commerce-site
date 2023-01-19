/* eslint-disable no-unused-vars */
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { MY_HOST } from '../../my-config';

export default function Cart() {
  const params = new URLSearchParams(document.location.search);
  const orderId = params.get('od_sid');
  const param = useLocation();
  const [currentParam, setCurrentParam] = useState(param.pathname);
  const [order, setOrder] = useState([]);
  const [show, setShow] = useState('');

  const getOrderInfo = async () => {
    const res = await axios.get(
      `${MY_HOST}/cart/orderDetails?orderId=${orderId}`
    );
    for (let i = 0; i < res.data.rows.length; i++) {
      res.data.rows[i].ordered_at = dayjs(res.data.rows[i].ordered_at).format(
        'YYYY-MM-DD HH:mm'
      );
    }
    setOrder(res.data.rows);
  };

  useEffect(() => {
    getOrderInfo();
  }, []);

  return (
    <div className=" h-screen">
      <div className="cartProgressBar my-8 w-[80%] flex mx-auto">
        <div className="progress flex h-full p-2 items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="progressSvg">
              <i className="fa-light fa-ballot-check" />
            </div>
            <div className="progressText">
              <p className="text-xs">確認訂單</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg">
              <i className={`fa-regular fa-credit-card`} />
            </div>
            <div className="progressText">
              <p className={`text-xs`}>確認付款</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="progressSvg">
              <i
                className={`fa-regular fa-file-check ${
                  currentParam === '/success' ? 'text-[#40220f]' : ''
                }`}
              />
            </div>
            <div className="progressText">
              <p
                className={`text-xs ${
                  currentParam === '/success' ? 'text-[#40220f]' : ''
                }`}
              >
                完成訂單
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="cartItem flex flex-col w-[90%] mx-auto bg-white p-3">
        {order.length &&
          order.map((e, i) => {
            return (
              <div key={e.orders_num}>
                <div>
                  <p
                    className={`text-black mb-1 ${
                      show === e.orders_num ? 'h-10' : 'truncate'
                    }`}
                  >
                    訂單編號：{e.orders_num}
                  </p>
                  <p
                    className="mb-1 hover:underline cursor-pointer"
                    onClick={() => {
                      if (show && show === e.orders_num) {
                        setShow('');
                      } else if (show !== e.orders_num) {
                        setShow(e.orders_num);
                      }
                    }}
                  >
                    顯示更多
                  </p>
                </div>
                <div>
                  <p>訂單時間：{e.ordered_at}</p>
                </div>
                <div>
                  <p>付款方式：{e.pay_way}</p>
                </div>
              </div>
            );
          })}
      </div>
      <div className="totalPrice w-full flex justify-end pr-5 mt-3">
        <p className="text-black">
          金額：
          <span className="ml-2 text-red-600">{order[0]?.total_price}</span>
        </p>
      </div>
    </div>
  );
}
