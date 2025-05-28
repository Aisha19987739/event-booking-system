// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // تأكد أن هذا موجود عندك

const LoginPage: React.FC = () => {
  const { login } = useAuth(); // login(email, password) => boolean
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('فشل تسجيل الدخول. تأكد من البيانات.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          تسجيل الدخول
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="كلمة المرور"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            دخول
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
