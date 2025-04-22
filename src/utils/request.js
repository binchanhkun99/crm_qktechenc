import axios from 'axios';

// Tạo instance axios với baseURL
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Cập nhật baseURL để khớp với API của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm để thiết lập Authorization header
export const setAuth = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const { access_token } = JSON.parse(user);
    if (access_token) {
      request.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    }
  }
};

// Hàm để xóa Authorization header
export const clearAuth = () => {
  delete request.defaults.headers.common['Authorization'];
};

// Interceptor để bỏ qua Authorization header cho /login và /register
request.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    // Không thêm Authorization header cho /login và /register
    if (url.endsWith('/login') || url.endsWith('/register')) {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi 401
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      localStorage.removeItem('user');
      // Chuyển hướng đến trang login (tùy chọn)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;