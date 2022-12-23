/* eslint-disable jsx-a11y/label-has-associated-control */
// import axios from 'axios';
import React from 'react';

export default function Login() {
  // const handleSubmit = async () => {
  //   const { data } = await axios.post('');
  // };
  return (
    <>
      <div className="flex flex-col mt-10 mb-3">
        <label htmlFor="mail" className="text-black">信箱</label>
        <input type="text" className="mail w-1/2 md:w-[200px] bg-white" name="mail" id="mail" />
        <label htmlFor="password" className="text-black">密碼</label>
        <input type="text" className="password w-1/2 md:w-[200px] bg-white" name="password" id="password" />
      </div>
      <button
        type="button"
        className="btn border-none bg-[#f8b62b] text-white p-2 rounded-lg"
      // onClick={handleSubmit}
      >
        登入

      </button>
    </>
  );
}
