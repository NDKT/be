import { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductSection from '../components/ProductSection';
import productApi from '../api/productApi';

// ✅ Danh sách Categories lấy từ Backend
const CATEGORIES = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Books" },
  { id: 4, name: "Home & Garden" },
  { id: 5, name: "Sports" },
  { id: 6, name: "Toys & Games" },
  { id: 7, name: "Beauty & Health" },
  { id: 8, name: "Automotive" },
  { id: 9, name: "Furniture" },
  { id: 10, name: "Pet Supplies" },
  { id: 11, name: "Office Supplies" },
  { id: 12, name: "Food & Beverage" },
  { id: 13, name: "Jewelry" },
  { id: 14, name: "Music & Instruments" },
  { id: 15, name: "Baby Products" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll();
        
        // Xử lý dữ liệu trả về (phân trang hoặc mảng trực tiếp)
        if (response.data && Array.isArray(response.data.items)) {
          setProducts(response.data.items);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
        setError(null);
      } catch (err) {
        console.error('❌ Lỗi lấy sản phẩm:', err);
        setError('Không thể tải sản phẩm.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSlider />

      {/* ✅ Tự động lặp qua các Category để render Section */}
      {CATEGORIES.map((category) => {
        // Lọc sản phẩm thuộc category hiện tại
        const categoryProducts = products.filter(
          (p) => p.categoryId === category.id
        );

        // Nếu danh mục này không có sản phẩm nào thì ẩn đi (tránh giao diện bị trống)
        if (categoryProducts.length === 0) return null;

        return (
          <ProductSection
            key={category.id}
            title={category.name} // Hiển thị tên Category (VD: Electronics)
            products={categoryProducts}
            categoryLink={`/danh-muc/${category.id}`} // Link chuyển đến trang xem tất cả của danh mục đó
          />
        );
      })}
    </>
  );
};

export default Home;