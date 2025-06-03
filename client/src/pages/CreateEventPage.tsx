import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, MenuItem, Box, Paper
} from '@mui/material';
import { createEvent } from '../sevices/eventService';
import { getAllCategories, type Category } from '../sevices/categoryService';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// لحل مشكلة الأيقونات الافتراضية في Leaflet


// إصلاح مشكلة marker icons في Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const CreateEventPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    price: '',
    capacity: '',
    category: '',
    latitude: '',
    longitude: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: new Date(formData.date).toISOString(),
        price: formData.price ? parseFloat(formData.price) : undefined,
        capacity: parseInt(formData.capacity),
        category: formData.category,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        image: imageFile,
      });
      setSuccess('تم إنشاء الفعالية بنجاح!');
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        price: '',
        capacity: '',
        category: '',
        latitude: '',
        longitude: ''
        
      });
      
      setImageFile(null);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const msg = err.response.data.errors.map((e: any) => e.msg).join(' | ');
        setError(msg);
      } else {
        setError('حدث خطأ أثناء إنشاء الفعالية');
        console.error(err);
      }
    }
  };

  // مكون مخصص لتحديث الإحداثيات عند النقر على الخريطة
  const LocationMarker: React.FC = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          latitude: e.latlng.lat.toFixed(6),
          longitude: e.latlng.lng.toFixed(6)
        });
      }
    });

    return formData.latitude && formData.longitude ? (
      <Marker
        position={[
          parseFloat(formData.latitude),
          parseFloat(formData.longitude)
        ]}
      />
    ) : null;
  };
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>إنشاء فعالية</Typography>

        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField label="العنوان" name="title" fullWidth margin="normal" value={formData.title} onChange={handleChange} required />
          <TextField label="الوصف" name="description" fullWidth margin="normal" multiline minRows={3} value={formData.description} onChange={handleChange} />
          <TextField label="الموقع" name="location" fullWidth margin="normal" value={formData.location} onChange={handleChange} required />

          {/* خريطة تفاعلية */}
          <Box sx={{ height: 300, my: 2 }}>
            <MapContainer
              center={[24.7136, 46.6753]} // الرياض كنقطة افتراضية
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
          </Box>

          <TextField
            label="خط العرض (Latitude)"
            name="latitude"
            type="number"
            fullWidth
            margin="normal"
            value={formData.latitude}
            onChange={handleChange}
          />
          <TextField
            label="خط الطول (Longitude)"
            name="longitude"
            type="number"
            fullWidth
            margin="normal"
            value={formData.longitude}
            onChange={handleChange}
          />

          <TextField
            label="التاريخ"
            name="date"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField label="السعر" name="price" type="number" fullWidth margin="normal" value={formData.price} onChange={handleChange} />
          <TextField label="العدد الأقصى" name="capacity" type="number" fullWidth margin="normal" value={formData.capacity} onChange={handleChange} required />

          <TextField
            label="الفئة"
            name="category"
            fullWidth
            margin="normal"
            select
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.length === 0 ? (
              <MenuItem disabled>تحميل الفئات...</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))
            )}
          </TextField>

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            اختر صورة
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>

          {imageFile && <Typography sx={{ mt: 1 }}>{imageFile.name}</Typography>}
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            إنشاء الفعالية
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEventPage;
