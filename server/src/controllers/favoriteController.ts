// controllers/favorite.controller.ts
import { Request, Response } from 'express';
import Favorite from '../models/favorite';

export const addFavorite = async (req: Request, res: Response) => {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
   res.status(401).json({ message: 'Unauthorized' });
    return;
}



  const { eventId } = req.body;
  const userId = req.user!.userId;

  const favorite = await Favorite.findOneAndUpdate(
    { user: userId, event: eventId },
    { user: userId, event: eventId },
    { upsert: true, new: true }
  );
  res.status(201).json({ message: 'Event added to favorites', favorite });
};

export const removeFavorite = async (req: Request, res: Response) => {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
   res.status(401).json({ message: 'Unauthorized' });
    return;
}



    
  const { eventId } = req.params;
  const userId = req.user!.userId;

  await Favorite.findOneAndDelete({ user: userId, event: eventId });
  res.status(200).json({ message: 'Event removed from favorites' });
};

export const getUserFavorites = async (req: Request, res: Response) => {
    if (!req.user || typeof req.user === 'string' || !req.user.userId) {
   res.status(401).json({ message: 'Unauthorized' });
    return;
}

const userId = req.user.userId;

  

  const favorites = await Favorite.find({ user: userId }).populate('event');
  res.status(200).json(favorites.map(fav => fav.event));
};
