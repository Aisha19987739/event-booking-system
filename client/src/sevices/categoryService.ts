// src/services/categoryService.ts

import api from './api';

export interface Category {
  _id: string;
  name: string;
}

export const getAllCategories = async () => {
  const response = await api.get('/categories'); // تأكد من صحة المسار حسب API
  return response.data;
};
