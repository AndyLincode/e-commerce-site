import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// 使用在 redux 中定義的 state
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { setLogout } from '../model/userSlice';

const MySwal = withReactContent(Swal);

function Navbar() {
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state.user);
  // eslint-disable-next-line no-shadow
  const cartState = useSelector((state) => state.cart);
  // eslint-disable-next-line no-unused-vars
  const cartAmount = cartState.cart?.length > 0 ? cartState.cart.map((e, i) => e.amount) : 0;
  // eslint-disable-next-line max-len
  const amount = cartAmount ? cartAmount.reduce((accumulator, currentValue) => accumulator + currentValue) : 0;
  // if (localStorage.getItem('auth')) {
  //   state.profile.login = JSON.parse(localStorage.getItem('auth').login);
  // }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // nav item & link
  const item = [
    { name: 'HOME', link: '/' },
    { name: 'STORE', link: '/store' },
    { name: 'LOGIN', link: '/login' },
  ];
  // mobile navbar open & close
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const handleLogout = () => {
    dispatch(setLogout());
    MySwal.fire({
      title: <strong>已登出</strong>,
      text: '期待您再回來！',
      icon: 'success',
    });
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className="shadow-md w-full fix left-0 top-0">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-3">
        <div className="font-bold text-2xl cursor-pointer flex items-center font-mono text-yellow-800">
          <span className="text-3xl text-yellow-800 mx-2"><i className="fa-regular fa-paw" /></span>
          PET
        </div>
        {state.profile.login ? (
          <p className=" absolute top-0 right-6 text-sm">{`歡迎，${state.profile.name}`}</p>
        ) : (<p className="absolute top-0 right-6 text-sm">未登入</p>)}
        <div className="cart text-xl absolute right-[60px] top-5 text-yellow-800 cursor-pointer md:hidden z-[2]">
          <button
            type="button"
            className=" text-sm w-10 absolute top-2 right-[30px]"
            onClick={() => {
              if (state.profile.login) {
                handleLogout();
              } else {
                navigate('/login');
              }
            }}
          >
            {state.profile.login ? '登出' : '登入'}

          </button>
          <i className="fa-regular fa-cart-shopping" />
          <span className="flex justify-center align-middle items-center absolute rounded-full w-5 h-5 bg-red-600 bg-opacity-90 text-xs text-center right-[-10px] bottom-[-2px] text-white">{amount > 10 ? '10+' : amount}</span>
        </div>
        <div
          role="presentation"
          className="text-2xl absolute right-6 top-5 text-yellow-800 cursor-pointer md:hidden z-[2]"
          onClick={() => setOpen(!open)}
        >
          <i className={open ? 'fa-light fa-xmark' : 'fa-light fa-bars'} />

        </div>
        <ul className={`md:flex items-center absolute md:static bg-white md:z-auto z-[1] left-0 w-full md:w-auto md:pl-0 pl-6 transition-all duration-500 ease-in ${open ? 'top-[65px] opacity-100' : 'top-[-200px] opacity-0'} md:opacity-100 `}>
          {item.map((link) => (
            <li key={link.name} className="md:ml-5 text-xl text-yellow-800 md:my-0 my-6 cursor-pointer">
              <Link to={link.link}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
