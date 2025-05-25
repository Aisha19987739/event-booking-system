import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import FavoritesPage from '../pages/FavoritesPage';

import ProtectedRoute from '../components/ProtectedRoute';
import EventsPage from '../pages/EventsPage';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />
        <Route path="/events" element={<EventsPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
