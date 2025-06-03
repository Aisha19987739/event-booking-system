// src/services/eventService.ts

import api from './api';
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string; // يمكنك استخدام Date إذا فضلت ذلك
  location: string;
  price: number;
  capacity: number;
  organizer: string; // أو يمكنك ربطه بنوع User لو أردت
  bookings: string[]; // أو يمكن تغييره حسب تصميمك
  category: string; // أو object حسب الـ populate في API
  image: string;
  createdAt: string;
  updatedAt: string;
   latitude?: number;
  longitude?: number;
  imageUrl?: string | null;
}




export const getEventById = async (eventId: string): Promise<Event | null> => {
  const response = await api.get(`/events/${eventId}`);
  return response.data || null;
};
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
  latitude?: number;
  longitude?: number;
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
  if (data.latitude) formData.append('latitude', data.latitude.toString());
  if (data.longitude) formData.append('longitude', data.longitude.toString());

  return api.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};



