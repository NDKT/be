import axiosClient from './axiosClient';

const categoryApi = {
  // Lấy tất cả danh mục
  getAll: () => axiosClient.get('/categories'),
};

export default categoryApi;