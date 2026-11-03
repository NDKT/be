import axiosClient from './axiosClient';

const productApi = {
  // Lấy tất cả sản phẩm (yêu cầu pageSize lớn để lấy đủ data test)
  // Nếu Backend chưa hỗ trợ query param pageSize, nó sẽ tự động bỏ qua và lấy mặc định.
  getAll: (params) => axiosClient.get('/products', { 
    params: { pageSize: 100, ...params } 
  }),

  // Lấy chi tiết 1 sản phẩm
  getById: (id) => axiosClient.get(`/products/${id}`),
  
  // Lấy sản phẩm theo danh mục
  getByCategory: (categoryId) => axiosClient.get(`/products/category/${categoryId}`),
};

export default productApi;