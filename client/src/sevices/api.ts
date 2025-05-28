// src/services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// إضافة Interceptor لإضافة التوكن لكل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // أو المكان الذي تخزن فيه التوكن

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
