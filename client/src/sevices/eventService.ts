// src/services/eventService.ts

import api from './api';

export interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  price?: number;
  capacity: number;
  imageUrl: string;
}

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events');
  return response.data.events; // ✅ هذه أهم نقطة
};
 
