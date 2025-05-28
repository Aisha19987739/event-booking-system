// src/components/Footer.tsx
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 4, py: 2, backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
      <Typography variant="body2">© 2025 Event Booking. All rights reserved.</Typography>
      <Typography variant="body2">Contact: support@example.com | About | Terms</Typography>
    </Box>
  );
};

export default Footer;
