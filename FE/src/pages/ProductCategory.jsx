import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productApi from '../api/productApi';

const ProductCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map ID sang tên hiển thị
  const categoryNames = {
    '1': 'ĐỒ ĐIỆN TỬ', '2': 'THỜI TRANG', '3': 'SÁCH', 
    '4': 'NHÀ CỬA & SÂN VƯỜN', '5': 'THỂ THAO', '6': 'ĐỒ CHƠI & TRÒ CHƠI',
    '7': 'SỨC KHỎE & LÀM ĐẸP', '8': 'Ô TÔ XE MÁY', '9': 'NỘI THẤT',
    '10': 'THÚ CƯNG', '11': 'VĂN PHÒNG PHẨM', '12': 'THỰC PHẨM & ĐỒ UỐNG',
    '13': 'TRANG SỨC', '14': 'NHẠC CỤ', '15': 'MẸ & BÉ'
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // ✅ Gọi API Backend: GET /api/Products/category/1
        const response = await productApi.getByCategory(categoryId);
        
        // Xử lý dữ liệu trả về (có thể là mảng hoặc object phân trang)
        if (response.data && Array.isArray(response.data.items)) {
          setProducts(response.data.items);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchCategoryProducts();
  }, [categoryId]);

  const title = categoryNames[categoryId] || 'DANH MỤC SẢN PHẨM';

  return (
    <div className="py-16 px-[5%] text-center">
      <h2 className="text-2xl md:text-3xl font-normal uppercase tracking-widest mb-10">
        {title}
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 text-left">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-gray-500">Hiện chưa có sản phẩm trong danh mục này.</p>
      )}

      <Link to="/" className="text-sm uppercase tracking-wider underline text-gray-700 hover:text-gold transition-colors">
        ← VỀ TRANG CHỦ
      </Link>
    </div>
  );
};

export default ProductCategory;