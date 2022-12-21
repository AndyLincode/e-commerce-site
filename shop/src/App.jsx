import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './Pages/Index/Index';
import Store from './Pages/Store/Store';
import Navbar from './Components/Navbar';
import Footer from './Pages/Index/Components/Footer';

function App() {
  return (
    <div className="App bg-yellow-100">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/store" element={<Store />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
