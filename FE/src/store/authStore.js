import { create } from 'zustand';

// ✅ Hàm phụ trợ để đọc localStorage an toàn (tránh lỗi crash nếu JSON bị hỏng)
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Lỗi đọc thông tin user từ localStorage:", error);
    localStorage.removeItem('user'); // Xóa dữ liệu hỏng
    return null;
  }
};

const useAuthStore = create((set) => ({
  // State
  user: getStoredUser(), // ✅ Gọi hàm an toàn
  token: localStorage.getItem('token') || null,

  // Actions
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;