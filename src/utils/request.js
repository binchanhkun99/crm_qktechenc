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
    const { token } = JSON.parse(user);
    if (token) {
      request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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



export default request;