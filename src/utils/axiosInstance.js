import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.1.15:4000/'
  // baseURL: 'http://localhost:4000/'
  // baseURL: 'http://192.168.29.27:4000/'
  baseURL: 'http://148.135.138.69:4000/'
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export { axiosInstance };