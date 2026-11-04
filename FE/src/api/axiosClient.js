import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', 
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Tự động gắn token nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401 (Token hết hạn hoặc sai)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chỉ chuyển hướng nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;