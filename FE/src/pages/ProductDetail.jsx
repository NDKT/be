import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productApi from '../api/productApi';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await productApi.getById(productId);
        setProduct(response.data);
      } catch (err) {
        console.error('❌ Lỗi:', err);
        setError('Không tìm thấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchDetail();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl mb-4">{error || 'Không tìm thấy sản phẩm!'}</h2>
        <Link to="/" className="underline hover:text-gold">Quay lại trang chủ</Link>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const imageSrc = product.imageUrl?.trim()
    ? product.imageUrl
    : `https://placehold.co/600x750/f0f0f0/999?text=${encodeURIComponent(product.name.slice(0, 20))}`;

  return (
    <div className="flex flex-wrap gap-12 px-[10%] py-16">
      <div className="flex-1 min-w-[300px]">
        <img src={imageSrc} alt={product.name} className="w-full rounded-lg bg-gray-50" />
      </div>

      <div className="flex-1 min-w-[300px] pt-2">
        <p className="text-[13px] text-gray-500 mb-4">
          <Link to="/" className="underline">Trang chủ</Link> / Chi tiết
        </p>
        <h1 className="text-2xl md:text-3xl font-normal leading-snug mb-4">{product.name}</h1>
        <p className="text-2xl md:text-3xl font-bold mb-8">{formatPrice(product.price)}</p>

        <div className="mb-4">
          <p className="font-medium mb-2">Tồn kho: {product.stock} sản phẩm</p>
        </div>

        <div className="mb-8">
          <p className="font-medium mb-3">Mô tả:</p>
          <p className="text-sm text-gray-700 leading-relaxed">{product.description || 'Đang cập nhật...'}</p>
        </div>

        <div className="mb-8">
          <p className="font-medium mb-3">Kích cỡ:</p>
          <div className="flex gap-2">
            {['35', '36', '37', '38', '39', '40'].map(size => (
              <button key={size} className="w-12 h-12 border border-gray-300 bg-white hover:bg-black hover:text-white transition-colors">
                {size}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full py-4 bg-black text-white text-base tracking-wider hover:bg-gold transition-colors mb-8">
          THÊM VÀO GIỎ HÀNG
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;