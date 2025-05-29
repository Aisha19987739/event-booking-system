// src/pages/EventsPage.tsx
import useEvents from '../hooks/useEvents';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

const EventsPage = () => {
  const { events, loading } = useEvents();
  

  if (loading) return <Typography>جاري تحميل الفعاليات...</Typography>;
  if (events.length === 0) return <Typography>لا توجد فعاليات حالياً</Typography>;

  return (
    <Grid container spacing={3} padding={4}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event._id}>
 <Card>
 

 <CardMedia
  component="img"
  height="160"
  image={event.imageUrl || 'https://event-image1.b-cdn.net/fallbacks/no-image.jpg'}
  alt={event.title}
/>

  <CardContent>
    <Typography variant="h6" gutterBottom>{event.title}</Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {event.description?.slice(0, 80) || 'لا يوجد وصف'}...
    </Typography>

    <Typography variant="body2" sx={{ mt: 1 }}>📍 {event.location}</Typography>
    <Typography variant="body2">📅 {new Date(event.date).toLocaleDateString()}</Typography>
    
    {event.price !== undefined && (
      <Typography variant="body2">💵 السعر: {event.price} ريال</Typography>
    )}

    <Typography variant="body2">👥 السعة: {event.capacity} شخص</Typography>
  </CardContent>
</Card>

        </Grid>
      ))}
    </Grid>
  );
  
};


export default EventsPage;
