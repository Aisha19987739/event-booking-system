// routes/favorite.routes.ts
import express from 'express';
import { addFavorite, removeFavorite, getUserFavorites } from '../controllers/favoriteController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();

router.use(authenticateToken);
router.post('/', addFavorite);
router.delete('/:eventId', removeFavorite);
router.get('/', getUserFavorites);

export default router;
