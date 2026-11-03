import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',   // ✅ Đi qua Vite proxy → http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Gắn JWT Token tự động nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;