import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi'; // ✅ Lấy danh mục động

const ProductCategory = () => {
  const { categoryId } = useParams();
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null); // ✅ Lưu thông tin danh mục
  const [brands, setBrands] = useState([]); // ✅ Lưu danh sách hãng (nếu có)
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null); // ✅ Hãng đang chọn
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 }); // ✅ Khoảng giá

  // ✅ Gọi song song API: Lấy danh mục + Sản phẩm
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Gọi song song 2 API để tối ưu tốc độ
        const [catRes, prodRes] = await Promise.all([
          categoryApi.getAll(), // Lấy tất cả danh mục
          productApi.getByCategory(categoryId) // Lấy sản phẩm theo danh mục
        ]);

        // --- 1. Xử lý danh mục ---
        const allCategories = Array.isArray(catRes.data) ? catRes.data : catRes.data?.items || [];
        const currentCat = allCategories.find(c => c.id.toString() === categoryId);
        setCategory(currentCat);

        // --- 2. Xử lý sản phẩm ---
        if (prodRes.data && Array.isArray(prodRes.data.items)) {
          setProducts(prodRes.data.items);
        } else if (Array.isArray(prodRes.data)) {
          setProducts(prodRes.data);
        } else {
          setProducts([]);
        }

        // --- 3. Trích xuất danh sách hãng từ sản phẩm (nếu có) ---
        // (Tạm thời lấy từ sản phẩm. Sau này nên gọi API /api/brands)
        const uniqueBrands = [...new Set(
          (prodRes.data?.items || prodRes.data || [])
            .map(p => p.brand?.name || p.brandName)
            .filter(Boolean)
        )];
        setBrands(uniqueBrands);

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchInitialData();
  }, [categoryId]);

  // ✅ Hàm lọc sản phẩm theo Hãng và Giá (Client-side filter)
  const filteredProducts = products.filter((p) => {
    // Lọc theo hãng
    const matchBrand = !selectedBrand || p.brand?.name === selectedBrand || p.brandName === selectedBrand;
    // Lọc theo giá
    const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
    return matchBrand && matchPrice;
  });

  const title = category?.name || 'DANH MỤC SẢN PHẨM';

  return (
    <div className="py-12 px-[5%]">
      {/* Breadcrumb */}
      <div className="text-[13px] text-gray-500 mb-6">
        <Link to="/" className="hover:text-black">Trang chủ</Link> 
        <span className="mx-2">/</span> 
        <span className="text-black font-medium">{title}</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-normal uppercase tracking-widest mb-10 text-center">
        {title}
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ✅ SIDEBAR BỘ LỌC (Bên trái) */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-28">
            {/* Lọc theo Hãng */}
            {brands.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">Thương hiệu</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={!selectedBrand}
                      onChange={() => setSelectedBrand(null)}
                    />
                    Tất cả
                  </label>
                  {brands.map((brand, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input 
                        type="radio" 
                        name="brand" 
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Lọc theo Giá */}
            <div>
              <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">Khoảng giá</h3>
              <div className="space-y-2">
                {[
                  { label: 'Tất cả', min: 0, max: 100000000 },
                  { label: 'Dưới 500.000đ', min: 0, max: 500000 },
                  { label: '500.000đ - 2.000.000đ', min: 500000, max: 2000000 },
                  { label: 'Trên 2.000.000đ', min: 2000000, max: 100000000 }
                ].map((range, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceRange.min === range.min && priceRange.max === range.max}
                      onChange={() => setPriceRange({ min: range.min, max: range.max })}
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ✅ DANH SÁCH SẢN PHẨM (Bên phải) */}
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="text-sm text-gray-500 mb-4">
                Hiển thị <span className="font-semibold text-black">{filteredProducts.length}</span> sản phẩm
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
              <button 
                onClick={() => {
                  setSelectedBrand(null);
                  setPriceRange({ min: 0, max: 100000000 });
                }}
                className="text-sm underline hover:text-gold"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link to="/" className="text-sm uppercase tracking-wider underline text-gray-700 hover:text-gold transition-colors">
          ← VỀ TRANG CHỦ
        </Link>
      </div>
    </div>
  );
};

export default ProductCategory;