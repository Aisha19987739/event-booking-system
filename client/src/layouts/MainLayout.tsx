import { Container } from '@mui/material';
import Navbar from '../components/Navbar';
import type { ReactNode } from 'react';


interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
};

export default MainLayout;
