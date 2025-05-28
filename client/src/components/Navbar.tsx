// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Event Booking
          </Link>
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/events">
            Browse Events
          </Button>

          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>

              {user?.role === 'organizer' && (
                <Button color="inherit" component={Link} to="/events/create">
                  Create Event
                </Button>
              )}

              {user?.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Panel
                </Button>
              )}

              {user?.role === 'user' && (
                <Button color="inherit" component={Link} to="/favorites">
                  Favorites
                </Button>
              )}

              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
