import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, categoryLink }) => {
  return (
    <section className="py-16 px-[5%] text-center">
      <h2 className="text-2xl md:text-3xl font-normal uppercase tracking-widest mb-10">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div>
        <Link 
          to={categoryLink || "/danh-muc/all"} 
          className="text-sm uppercase tracking-wider underline text-gray-700 hover:text-gold transition-colors"
        >
          XEM TẤT CẢ
        </Link>
      </div>
    </section>
  );
};

export default ProductSection;