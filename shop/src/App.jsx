import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userSlice from './model/userSlice';
import cartSlice from './model/cartSlice';
import Index from './Pages/Index/Index';
import Store from './Pages/Store/Store';
import Navbar from './Components/Navbar';
import Footer from './Pages/Index/Components/Footer';
import Login from './Pages/Member/Login';
import Cart from './Pages/Cart/Cart';
import CartDemo from './Pages/Cart/CartDemo';
import CartSuccess from './Pages/Cart/CartSuccess';

const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
  },
});

function App() {
  return (
    <Provider store={store}>
      <div className="App bg-[#fff5de] h-full">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/store" element={<Store />} />
            <Route path="/check" element={<CartDemo />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<CartSuccess />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
