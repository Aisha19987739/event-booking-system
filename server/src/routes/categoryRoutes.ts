import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticateToken } from '../middleware/authenticateToken'; // تأكد من أن هذا موجود لديك

const router = express.Router();

// ✅ عرض جميع الفئات (Public)
router.get('/', getAllCategories);

// ✅ إنشاء فئة جديدة (Admins فقط)
router.post('/', authenticateToken, createCategory);

// ✅ تعديل فئة (Admins فقط)
router.put('/:categoryId', authenticateToken, updateCategory);

// ✅ حذف فئة (Admins فقط)
router.delete('/:categoryId', authenticateToken, deleteCategory);

export default router;
