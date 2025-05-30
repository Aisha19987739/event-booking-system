import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import FavoritesPage from "../pages/FavoritesPage";
import EventsPage from "../pages/EventsPage";
import CreateEventPage from "../pages/CreateEventPage";
import HomePage from "../pages/HomePage";

import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import EventDetailsPage from "../pages/EventDetailsPage";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "organizer", "admin"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute allowedRoles={["user", "organizer", "admin"]}>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
          <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events" element={<EventsPage />} />
      
        <Route
          path="/events/create"
          element={
            <ProtectedRoute allowedRoles={["user", "organizer", "admin"]}>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
