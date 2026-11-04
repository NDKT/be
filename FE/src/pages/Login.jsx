import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import useAuthStore from '../store/authStore'; // ✅ Import Zustand store

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const login = useAuthStore((state) => state.login); // ✅ Lấy action login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ username, password });
      
      // Tùy thuộc backend trả về (check log để chắc chắn)
      const token = response.data.token || response.data;
      const userData = response.data.user || { name: username, userName: username };

      if (!token) throw new Error("Không nhận được token từ server");

      // ✅ Gọi Zustand action (nó tự lưu localStorage + update Header)
      login(token, userData);

      // Chuyển hướng ngay, KHÔNG cần reload
      navigate('/');
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || 
        'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 md:p-10 shadow-xl rounded-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-widest text-black mb-2">MWC</h2>
          <p className="text-gray-500 text-sm">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="Nhập username..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium tracking-wider transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gold'
            }`}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-black font-semibold underline hover:text-gold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;