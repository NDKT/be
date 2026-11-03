import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // ✅ Fallback ảnh nếu API trả về link lỗi hoặc rỗng
  const imageSrc = product.imageUrl?.trim() 
    ? product.imageUrl 
    : `https://placehold.co/400x500/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.substring(0, 20))}`;

  return (
    <Link to={`/san-pham/${product.id}`} className="block group">
      <div className="relative overflow-hidden mb-4 bg-gray-50 aspect-[4/5]">
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          onError={(e) => {
            // Nếu ảnh từ backend bị lỗi (404), thay bằng ảnh placeholder
            e.target.src = `https://placehold.co/400x500/f3f4f6/9ca3af?text=Lỗi+Ảnh`;
          }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white text-black px-6 py-2.5 font-semibold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white">
            Xem nhanh
          </button>
        </div>
      </div>
      
      <div className="text-left">
        <h4 className="text-sm font-normal text-gray-800 leading-snug line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h4>
        <p className="text-base font-semibold mb-2">{formatPrice(product.price)}</p>
        {/* Vì CSDL chưa có bảng Variants, tạm thời hiển thị màu tĩnh */}
        <div className="flex gap-2">
          <span className="w-4 h-4 rounded-full border border-gray-300 bg-black"></span>
          <span className="w-4 h-4 rounded-full border border-gray-300 bg-gray-200"></span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;