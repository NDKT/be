import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12">
      {/* Top Footer */}
      <div className="flex flex-wrap justify-between px-[10%] py-12 bg-white border-t border-gray-100 gap-8">
        <div className="flex-1 min-w-[250px]">
          <h4 className="text-sm font-semibold mb-4">GỌI MUA HÀNG ONLINE (08:00 - 21:00 mỗi ngày)</h4>
          <p className="text-2xl font-normal mb-1">1900.633.349</p>
          <p className="text-[13px] text-gray-600 leading-relaxed mb-6">Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
          
          <h4 className="text-sm font-semibold mb-4">GÓP Ý & KHIẾU NẠI (08:30 - 20:30)</h4>
          <p className="text-2xl font-normal mb-1">1900.633.349</p>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h4 className="text-sm font-semibold mb-4">THÔNG TIN</h4>
          <ul className="space-y-3">
            {['Giới thiệu về MWC', 'Điều kiện giao dịch chung', 'Thanh Phiền Góp Ý', 'Chính sách và quy định'].map(item => (
              <li key={item} className="text-[13px] text-gray-600 hover:text-black hover:underline cursor-pointer">› {item}</li>
            ))}
          </ul>
        </div>

        <div className="flex-1 min-w-[200px]">
          <h4 className="text-sm font-semibold mb-4">FAQ</h4>
          <ul className="space-y-3 mb-6">
            {['Chính Sách Vận chuyển', 'Chính sách Thanh Toán', 'Chính sách đổi trả bảo hành', 'Đối tác cung cấp'].map(item => (
              <li key={item} className="text-[13px] text-gray-600 hover:text-black hover:underline cursor-pointer">› {item}</li>
            ))}
          </ul>
          <div className="flex gap-4 text-xl text-gray-800">
            <i className="fa-brands fa-facebook cursor-pointer hover:text-blue-600"></i>
            <i className="fa-brands fa-instagram cursor-pointer hover:text-pink-600"></i>
            <i className="fa-brands fa-youtube cursor-pointer hover:text-red-600"></i>
            <i className="fa-brands fa-tiktok cursor-pointer hover:text-black"></i>
          </div>
        </div>
      </div>

      {/* Bottom Footer (Black Background) */}
      <div className="bg-black text-white text-center px-[10%] py-10 relative">
        <h3 className="text-xl font-normal tracking-wider mb-2">HỆ THỐNG CỬA HÀNG</h3>
        <a href="#/" className="text-[13px] underline block mb-8 hover:text-gold transition-colors">Xem địa chỉ các cửa hàng</a>
        
        <div className="text-left border-t border-white/20 pt-6 text-[13px] leading-loose max-w-3xl">
          <p className="font-semibold">HỘ KINH DOANH SHOP GIÀY MWC</p>
          <p>Địa chỉ: ĐC: 214/14 Nguyễn Trãi, Phường Cầu Ông Lãnh, Tp Hồ Chí Minh, Việt Nam</p>
          <p>MST: 068179001399 | Chủ Hộ Kinh Doanh: Huỳnh Thị Mỹ Hằng</p>
        </div>
        
        <div className="absolute bottom-10 right-[10%]">
          <img src="https://via.placeholder.com/150x50?text=Da+Thong+Bao" alt="Đã thông báo Bộ Công Thương" className="h-12" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;