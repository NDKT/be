import { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductSection from '../components/ProductSection';
import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi'; // ✅ Import API Category

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ State lưu categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ✅ Gọi song song 2 API để tăng tốc độ
        const [productRes, categoryRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll()
        ]);
        
        // --- Xử lý dữ liệu Sản phẩm (có thể bị phân trang) ---
        if (productRes.data && Array.isArray(productRes.data.items)) {
          setProducts(productRes.data.items);
        } else if (Array.isArray(productRes.data)) {
          setProducts(productRes.data);
        } else {
          setProducts([]);
        }

        // --- Xử lý dữ liệu Danh mục (thường trả về mảng trực tiếp) ---
        if (Array.isArray(categoryRes.data)) {
          setCategories(categoryRes.data);
        } else if (categoryRes.data && Array.isArray(categoryRes.data.items)) {
          setCategories(categoryRes.data.items);
        } else {
          setCategories([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Lỗi lấy dữ liệu:', err);
        setError('Không thể tải dữ liệu. Vui lòng kiểm tra Backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
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

      {/* ✅ Lặp qua danh sách Categories ĐỘNG lấy từ Backend */}
      {categories.map((category) => {
        // Lọc sản phẩm thuộc category hiện tại
        const categoryProducts = products.filter(
          (p) => p.categoryId === category.id
        );

        // Nếu danh mục này không có sản phẩm nào thì ẩn đi
        if (categoryProducts.length === 0) return null;

        return (
          <ProductSection
            key={category.id}
            title={category.name} // ✅ Lấy tên động (Electronics, Clothing...)
            products={categoryProducts}
            categoryLink={`/danh-muc/${category.id}`} 
          />
        );
      })}

      {/* Thông báo nếu không có bất kỳ sản phẩm nào */}
      {categories.length > 0 && products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Hiện chưa có sản phẩm nào trong cửa hàng.
        </div>
      )}
    </>
  );
};

export default Home;