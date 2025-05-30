import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import { useEventbyId } from '../hooks/useEvents'; // تأكد من مسار استيراد الهُوك

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
   

  console.log('Event ID from params:', id);
  const navigate = useNavigate();

  // استدعاء الهُوك الخاص بجلب بيانات الحدث بواسطة المعرف
  const { data: event, isLoading, error } = useEventbyId(id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={5} align="center">
        حدث خطأ أثناء جلب بيانات الفعالية.
      </Typography>
    );
  }

  if (!event) {
    return (
      <Typography mt={5} align="center">
        لم يتم العثور على الفعالية.
      </Typography>
    );
  }

  return (
    <Box p={3} maxWidth={700} margin="auto">
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={event.imageUrl || 'https://event-image1.b-cdn.net/fallbacks/no-image.jpg'}
          alt={event.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{event.title}</Typography>
          <Typography variant="body1" paragraph>{event.description || 'لا يوجد وصف.'}</Typography>

          <Typography variant="body2" color="text.secondary">📍 الموقع: {event.location}</Typography>
          <Typography variant="body2" color="text.secondary">
            📅 التاريخ: {new Date(event.date).toLocaleDateString()}
          </Typography>
          {event.price !== undefined && (
            <Typography variant="body2" color="text.secondary">
              💵 السعر: {event.price} ريال
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            👥 السعة: {event.capacity} شخص
          </Typography>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={() => navigate(`/booking/${event._id}`)}>
              الحجز الآن
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              العودة
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventDetailsPage;
