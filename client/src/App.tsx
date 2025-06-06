
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRoutes';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <AuthProvider>
      
      <AppRouter />
    
    </AuthProvider>
    
    
  );
}

export default App;
