import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { useEventbyId } from '../hooks/useEvents';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const isValidLatitude = (lat: number) => lat >= -90 && lat <= 90;
const isValidLongitude = (lng: number) => lng >= -180 && lng <= 180;

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEventbyId(id);

  // إحداثيات مركز الخريطة (افتراضي الرياض)
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.7136, 46.6753]);

  // الإحداثيات في الحقول النصية
  const [latitude, setLatitude] = useState(24.7136);
  const [longitude, setLongitude] = useState(46.6753);

  // لما تجي بيانات الحدث، حدث الإحداثيات
  useEffect(() => {
    if (event?.latitude && event?.longitude) {
      setMapCenter([event.latitude, event.longitude]);
      setLatitude(event.latitude);
      setLongitude(event.longitude);
    }
  }, [event]);

  // تحديث مركز الخريطة والعلامة بعد التحقق من صحة الإحداثيات
  const handleUpdateMapCenter = () => {
    if (!isValidLatitude(latitude)) {
      alert('خطأ: خط العرض يجب أن يكون بين -90 و 90.');
      return;
    }
    if (!isValidLongitude(longitude)) {
      alert('خطأ: خط الطول يجب أن يكون بين -180 و 180.');
      return;
    }
    setMapCenter([latitude, longitude]);
  };

  if (!id) {
    return (
      <Typography color="error" mt={5} align="center">
        المعرف غير موجود.
      </Typography>
    );
  }

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
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description || 'لا يوجد وصف.'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 الموقع: {latitude}, {longitude}
          </Typography>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/booking/${event._id}`)}
            >
              الحجز الآن
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              العودة
            </Button>
          </Box>

          {/* حقول تعديل الإحداثيات */}
          <Box mt={4} display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Latitude"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              inputProps={{ step: "any" }}
            />
            <TextField
              label="Longitude"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
              inputProps={{ step: "any" }}
            />
            <Button variant="contained" color="secondary" onClick={handleUpdateMapCenter}>
              تحديث الخريطة
            </Button>
          </Box>

          {/* الخريطة */}
          <Box mt={4} height={400} width="100%">
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} key={`${mapCenter[0]}-${mapCenter[1]}`}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter} key={`${mapCenter[0]}-${mapCenter[1]}`}>
                <Popup>{event.title}</Popup>
              </Marker>
            </MapContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventDetailsPage;
