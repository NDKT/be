import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp!');
    }
    if (formData.password.length < 6) {
      return setError('Mật khẩu phải có ít nhất 6 ký tự!');
    }

    try {
      setLoading(true);
      
      // ✅ Gửi đúng key viết hoa theo DTO của Backend (RegisterRequest.cs)
      const payload = {
        Username: formData.username,
        Password: formData.password,
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone
      };

      await authApi.register(payload);
      
      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Register Error:", err);
      // Lấy message lỗi từ Backend trả về (vd: trùng username)
      setError(
        err.response?.data?.message || 
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 md:p-10 shadow-xl rounded-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-widest text-black mb-2">MWC</h2>
          <p className="text-gray-500 text-sm">Tạo tài khoản mới để mua sắm</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4 text-center border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded mb-4 text-center border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text" name="username" required
              value={formData.username} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="VD: nguyenvana"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="VD: email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel" name="phone" required
              value={formData.phone} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="VD: 0901234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password" name="password" required
              value={formData.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password" name="confirmPassword" required
              value={formData.confirmPassword} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2.5 outline-none focus:border-black transition-colors"
              placeholder="Nhập lại mật khẩu..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 text-white font-medium tracking-wider transition-colors mt-2 ${
              (loading || success) ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gold'
            }`}
          >
            {loading ? 'ĐANG XỬ LÝ...' : success ? 'THÀNH CÔNG' : 'ĐĂNG KÝ'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-black font-semibold underline hover:text-gold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;