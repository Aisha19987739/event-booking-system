// src/hooks/useFilteredEvents.ts
import { useQuery } from '@tanstack/react-query';

import api from '../sevices/api';

interface UseFilteredEventsProps {
  search?: string;
  location?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const useFilteredEvents = ({
  search = '',
  location = '',
  category = '',
  sortBy = 'createdAt',
  order = 'desc',
  page = 1,
  limit = 6,
}: UseFilteredEventsProps) => {
  return useQuery({
    queryKey: ['filteredEvents', search, location, category, sortBy, order, page, limit],
    queryFn: async () => {
      const res = await api.get('/events', {
        params: { search, location, category, sortBy, order, page, limit },
      });
      return res.data;
    }
   
  });
};
