import { Request, Response } from 'express';
import Category from '../models/Category';
import { JwtPayload } from 'jsonwebtoken';
import Event from '../models/Event';  // المسار الصحيح لموديل Event


// ✅ إضافة فئة جديدة (Admins فقط)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { role: string };

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admins only.' });
    return;
  }

  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Category name is required' });
    return;
  }

  try {
    const existing = await Category.findOne({ name });
    if (existing) {
      res.status(409).json({ message: 'Category already exists' });
      return;
    }

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

// ✅ عرض جميع الفئات (Public)
export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// ✅ تعديل فئة (Admins فقط)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { role: string };
  const { categoryId } = req.params;
  const { name, description } = req.body;

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admins only.' });
    return;
  }

  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    );

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// ✅ حذف فئة (Admins فقط)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { role: string };
  const { categoryId } = req.params;

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admins only.' });
    return;
  }

  try {
    // التحقق إذا كانت هناك أحداث مرتبطة بالفئة
    const linkedEvents = await Event.findOne({ category: categoryId });

    if (linkedEvents) {
      res.status(400).json({ message: 'Cannot delete category: linked events exist.' });
      return;
    }

    const deleted = await Category.findByIdAndDelete(categoryId);

    if (!deleted) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};

