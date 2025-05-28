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



// src/services/eventService.ts


// src/services/eventService.ts


interface CreateEventData {
  title: string;
  description: string;
  location: string;
  date: string; // ISO format
  price?: number;
  capacity: number; // Frontend uses "capacity", backend expects "totalTickets"
  category: string;
  image?: File | null;
}


export const createEvent = (data: CreateEventData) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('location', data.location);
  formData.append('date', data.date);
  formData.append('category', data.category);
  formData.append('capacity', data.capacity.toString());

  if (data.price) formData.append('price', data.price.toString());
  if (data.image) formData.append('image', data.image);

  return api.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};



