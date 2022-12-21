import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  // nav item & link
  const item = [
    { name: 'HOME', link: '/' },
    { name: 'STORE', link: '/store' },
    { name: 'ABOUT', link: '/about' },
  ];
  // mobile navbar open & close
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
        <div className="cart text-xl absolute right-[60px] top-5 text-yellow-800 cursor-pointer md:hidden z-[2]">
          <i className="fa-regular fa-cart-shopping" />
          <span className="flex justify-center align-middle items-center absolute rounded-full w-4 h-4 bg-red-600 text-sm text-center right-[-6px] bottom-0 text-white">1</span>
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
