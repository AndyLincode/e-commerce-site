/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { MY_HOST } from '../../my-config';

const MySwal = withReactContent(Swal);

// eslint-disable-next-line react/prop-types
function SignUp({ setSign }) {
  const [userData, setUserData] = useState({
    name: '',
    account: '',
    password: '',
  });
  const [show, setShow] = useState(false)

  const handleChange = (e) => {
    setUserData(
      { ...userData, [e.target.name]: e.target.value },
    );
  };
  const handleSubmit = async () => {
    const data = await axios.post(`${MY_HOST}/member/add`, { userData });
    if (data.data.success) {
      MySwal.fire({
        title: <strong>註冊成功</strong>,
        text: '歡迎加入！',
        icon: 'success',
      });
      setSign(false);
    } else if (data.data.error === '重複帳號') {
      MySwal.fire({
        title: <strong>帳號重複</strong>,
        text: '請重新輸入帳號',
        icon: 'error',
      });
    } else {
      MySwal.fire({
        title: <strong>註冊失敗</strong>,
        text: '請重新註冊',
        icon: 'error',
      });
    }
  };
  return (
    <div className=" h-[295px] md:h-full">
      <div className="flex flex-col mt-10 mb-3 items-center">
        <label htmlFor="name" className="text-black">姓名</label>
        <input type="text" className="name w-1/2 md:w-[200px] bg-white" name="name" id="name" value={userData.name || ''} onChange={handleChange} />

        <label htmlFor="mail" className="text-black">信箱</label>
        <input type="text" className="mail w-1/2 md:w-[200px] bg-white" name="mail" id="mail" value={userData.mail || ''} onChange={handleChange} />

        <label htmlFor="password" className="text-black">密碼</label>
        <input type={show ? 'text' : 'password'} className="password w-1/2 md:w-[200px] bg-white" name="password" id="password" value={userData.password || ''} onChange={handleChange} />
        {show ? (
          <i className="fa-regular fa-eye absolute right-[100px] top-[233px] z-10" onClick={() => {
            setShow(!show)
          }}></i>
        ) : (
          <i className="fa-regular fa-eye-slash absolute right-[100px] top-[233px] z-10" onClick={() => {
            setShow(!show)
          }}></i>
        )
        }
        <i className="fa-regular fa-eye-slash hidden"></i>
        <i className="fa-regular fa-eye hidden"></i>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="btn border-none bg-[#f8b62b] text-white px-2 rounded-lg mr-3"
          onClick={handleSubmit}
        >
          註冊
        </button>
        <button
          type="button"
          onClick={() => {
            setUserData({
              name: 'Frank',
              mail: 'user@mail.com',
              password: '12345',
            });
          }}
        >
          快速填入
        </button>
      </div>
    </div>
  );
}

export default SignUp;
