import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between px-[5%] py-4 border-b border-gray-100">
        <Link to="/" className="text-3xl font-black tracking-widest text-black">
          MWC
        </Link>
        
        <nav className="hidden lg:block">
          <ul className="flex gap-6">
            {/* ✅ Sửa lại path trỏ đúng ID trong CSDL */}
            {[
              { name: 'ĐỒ ĐIỆN TỬ', path: '/danh-muc/1' },    // Electronics
              { name: 'THỜI TRANG', path: '/danh-muc/2' },    // Clothing
              { name: 'SÁCH', path: '/danh-muc/3' },          // Books
              { name: 'GIA DỤNG', path: '/danh-muc/4' },      // Home & Garden
              { name: 'THỂ THAO', path: '/danh-muc/5' },      // Sports
              { name: 'LÀM ĐẸP', path: '/danh-muc/7' },      // Beauty
            ].map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors hover:text-gold ${isActive ? 'text-gold' : 'text-gray-800'}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center border border-gray-300 rounded px-3 py-1.5 w-52">
            <input type="text" placeholder="Tìm kiếm..." className="w-full outline-none text-sm bg-transparent" />
            <button className="text-gray-500 hover:text-black">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <button className="text-xl hover:text-gold transition-colors">
            <i className="fa-regular fa-user"></i>
          </button>
          <button className="relative text-xl hover:text-gold transition-colors">
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="absolute -top-2 -right-2.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </button>
        </div>
      </div>

      {/* Bottom Header (Sub-nav) */}
      <div className="flex justify-center py-2.5 border-b border-gray-100 bg-white">
        <ul className="flex gap-8">
          <li><NavLink to="/danh-muc/6" className="text-[13px] font-medium hover:text-gold">ĐỒ CHƠI</NavLink></li>
          <li><NavLink to="/danh-muc/9" className="text-[13px] font-medium hover:text-gold">NỘI THẤT</NavLink></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;