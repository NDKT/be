import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductCategory from './pages/ProductCategory';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/danh-muc/:categoryId" element={<ProductCategory />} />
          <Route path="/san-pham/:productId" element={<ProductDetail />} />
          <Route path="*" element={
            <div className="py-24 text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p>Trang không tồn tại</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      
      {/* Floating Contact Buttons */}
      <div className="fixed bottom-5 left-5 flex flex-col gap-3 z-[1000]">
        <button className="w-12 h-12 rounded-full bg-[#0068ff] text-white flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform text-sm">
          Zalo
        </button>
        <button className="w-12 h-12 rounded-full bg-[#0084ff] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-2xl">
          <i className="fa-brands fa-facebook-messenger"></i>
        </button>
      </div>
    </Router>
  );
}

export default App;