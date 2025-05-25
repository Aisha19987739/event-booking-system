// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const roles = ['user', 'organizer', 'admin'];

const RegisterPage = () => {
  const { login } = useAuth(); // بعد التسجيل الناجح نسجل المستخدم تلقائياً
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'فشل التسجيل');

      await login(data.user.email, formData.password); // تسجيل الدخول مباشرة بعد التسجيل
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          تسجيل حساب جديد
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            label="الاسم الكامل"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="اسم المستخدم"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="كلمة المرور"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="الدور"
            name="role"
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={handleChange}
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role === 'user' ? 'مستخدم' : role === 'organizer' ? 'منظم' : 'مدير'}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            إنشاء حساب
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
