/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import axios from 'axios';
// 使用在 redux 中定義的 function
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { MY_HOST } from '../../my-config';
import { setLogin, setLogout } from '../../model/userSlice';

const MySwal = withReactContent(Swal);

export default function Login() {
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state.user);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const data = await axios.post(`${MY_HOST}/member/login_api`, { mail, password });
    // console.log(data.data);
    dispatch(setLogin(data.data));
    setMail('');
    setPassword('');
    if (mail && password && data.data.success) {
      MySwal.fire({
        title: <strong>登入成功</strong>,
        text: '歡迎！',
        icon: 'success',
      });
      navigate('/store');
    } else {
      MySwal.fire({
        title: <strong>登入失敗</strong>,
        text: '請輸入正確的信箱或密碼',
        icon: 'error',
      });
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
    MySwal.fire({
      title: <strong>已登出</strong>,
      text: '期待您再回來！',
      icon: 'success',
    });
  };
  return (

    state.profile.login
      ? (
        <button type="button" className="btn btn-error p-1 mt-2" onClick={handleLogout}>登出</button>
      ) : (
        <>
          <div className="flex flex-col mt-10 mb-3">
            <label htmlFor="mail" className="text-black">信箱</label>
            <input type="text" className="mail w-1/2 md:w-[200px] bg-white" name="mail" id="mail" value={mail} onChange={(e) => setMail(e.target.value)} />
            <label htmlFor="password" className="text-black">密碼</label>
            <input type="text" className="password w-1/2 md:w-[200px] bg-white" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button
            type="button"
            className="btn border-none bg-[#f8b62b] text-white p-2 rounded-lg"
            onClick={handleLogin}
          >
            登入
          </button>
          <button
            type="button"
            onClick={() => {
              setMail('dogcat@gmail.com');
              setPassword('0721');
            }}
          >
            快速登入

          </button>
        </>

      )

  );
}
