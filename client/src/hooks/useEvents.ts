// src/hooks/useEvents.ts
import { useEffect, useState } from 'react';
import  {getAllEvents, getEventById}  from '../sevices/eventService'
import  type { Event } from '../sevices/eventService';
import { useQuery } from '@tanstack/react-query';

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents(); // ✅ هذا يرجع فقط data.events الآن
        setEvents(data);
      } catch (error) {
        console.error('فشل في جلب الفعاليات', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading };
};
export const useEventbyId = (id: string | undefined) => {
  return useQuery<Event | null>({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
    retry: 1,
  });
};


export default useEvents;
