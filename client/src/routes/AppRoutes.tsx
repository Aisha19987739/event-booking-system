import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import FavoritesPage from '../pages/FavoritesPage';
import EventsPage from '../pages/EventsPage';
import CreateEventPage from '../pages/CreateEventPage';
import HomePage from '../pages/HomePage';

import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { Box, Container } from '@mui/material';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/events/create"
              element={
                <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Router>
  );
};

export default AppRouter;
