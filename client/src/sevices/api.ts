// src/sevices/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // مثال: رابط backend
  withCredentials: true, // إذا كنت تستخدم الكوكيز مع التوثيق
});

export default api;
