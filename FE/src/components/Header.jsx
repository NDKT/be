import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import categoryApi from '../api/categoryApi';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data && Array.isArray(res.data.items)) {
          setCategories(res.data.items);
        }
      } catch (error) {
        console.error("Lỗi tải danh mục Header:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ Chỉ lấy 4 danh mục đầu tiên hiển thị trực tiếp
  const mainCategories = categories.slice(0, 4);
  // ✅ Các danh mục còn lại đưa vào Combobox (Dropdown)
  const extraCategories = categories.slice(4);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-[3%] xl:px-[5%] py-4 border-b border-gray-100 gap-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-black tracking-widest text-black shrink-0">
          MWC
        </Link>
        
        {/* Main Nav */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-6">
          {/* Render 4 danh mục chính */}
          {mainCategories.map((item) => (
            <NavLink 
              key={item.id}
              to={`/danh-muc/${item.id}`}
              className={({ isActive }) => 
                `text-[14px] font-medium transition-colors hover:text-gold whitespace-nowrap ${isActive ? 'text-gold' : 'text-gray-800'}`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* ✅ COMBOBOX (DROPDOWN) CHO CÁC DANH MỤC CÒN LẠI */}
          {extraCategories.length > 0 && (
            <div className="relative group">
              <button className="text-[14px] font-medium text-gray-800 hover:text-gold transition-colors flex items-center gap-1 whitespace-nowrap py-2">
                DANH MỤC KHÁC
                <i className="fa-solid fa-chevron-down text-[10px] ml-1 transition-transform group-hover:rotate-180"></i>
              </button>
              
              {/* Nội dung Dropdown (Hiện khi hover) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white border border-gray-100 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <ul className="py-2 flex flex-col">
                  {extraCategories.map((item) => (
                    <li key={item.id}>
                      <NavLink 
                        to={`/danh-muc/${item.id}`}
                        className={({ isActive }) => 
                          `block px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 hover:text-gold ${isActive ? 'text-gold bg-gray-50' : 'text-gray-700'}`
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center border border-gray-300 rounded px-3 py-1.5 w-40 xl:w-56">
            <input type="text" placeholder="Tìm kiếm..." className="w-full outline-none text-sm bg-transparent" />
            <button className="text-gray-500 hover:text-black">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium hidden md:block text-gray-700">
                Hi, {user.name || user.userName || 'User'}
              </span>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-500 transition-colors" title="Đăng xuất">
                <i className="fa-solid fa-right-from-bracket text-lg"></i>
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-xl text-gray-800 hover:text-gold transition-colors" title="Đăng nhập">
              <i className="fa-regular fa-user"></i>
            </Link>
          )}

          <button className="relative text-xl text-gray-800 hover:text-gold transition-colors">
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="absolute -top-2 -right-2.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Header (Sub-nav) - Vẫn giữ lại nếu bạn muốn hiển thị thêm gì đó */}
      <div className="flex justify-center py-2 border-b border-gray-100 bg-white min-h-[40px]">
         <ul className="flex flex-row flex-nowrap items-center gap-8">
            <li><NavLink to="/danh-muc/5" className="text-[13px] font-medium hover:text-gold transition-colors">SẢN PHẨM BÁN CHẠY</NavLink></li>
            <li><NavLink to="/danh-muc/6" className="text-[13px] font-medium hover:text-gold transition-colors">PHỤ KIỆN</NavLink></li>
         </ul>
      </div>
    </header>
  );
};

export default Header;