import React from 'react';

const HeroSlider = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group">
      <img 
        src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1920&auto=format&fit=crop" 
        alt="Hero Banner" 
        className="w-full h-full object-cover object-center"
      />
      {/* Overlay tối nhẹ để chữ nổi bật */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="absolute top-1/2 right-[5%] md:right-[15%] -translate-y-1/2 text-center text-white z-10 drop-shadow-lg">
        <h3 className="text-lg md:text-xl tracking-[5px] font-light mb-2">GIÀY NAM</h3>
        <h1 className="font-serif text-6xl md:text-8xl font-normal mb-3">Lịch Lãm</h1>
        <p className="text-xl md:text-2xl font-light">trong từng bước chân</p>
      </div>

      {/* Nút điều hướng */}
      <button className="absolute top-1/2 left-5 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white text-2xl px-4 py-2 z-10 transition-all opacity-0 group-hover:opacity-100">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button className="absolute top-1/2 right-5 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white text-2xl px-4 py-2 z-10 transition-all opacity-0 group-hover:opacity-100">
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default HeroSlider;