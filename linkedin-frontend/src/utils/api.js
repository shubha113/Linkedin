import axios from 'axios';

const api = axios.create({
  baseURL: 'https://linkedin-1ab1.onrender.com',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

