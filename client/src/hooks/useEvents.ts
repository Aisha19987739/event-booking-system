// src/hooks/useEvents.ts
import { useEffect, useState } from 'react';
import  {getAllEvents}  from '../sevices/eventService'
import  type { Event } from '../sevices/eventService';

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

export default useEvents;
