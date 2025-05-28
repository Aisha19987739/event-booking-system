import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../sevices/api'; // تأكد من مسار الملف صحيح


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");

  const { login: setLogin, logout, user, isAuthenticated } = context;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data.user;
      const token = response.data.token;

      localStorage.setItem('token', token);
      setLogin(userData,token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};

