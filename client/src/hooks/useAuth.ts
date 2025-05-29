import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../sevices/api'; // تأكد أن المسار صحيح

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");

  const { login: setLogin, logout, user, isAuthenticated } = context;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });

      const token = response.data.token;
      if (!token) throw new Error('لم يتم استلام التوكن من السيرفر');

      // إذا كنت تفك التوكن داخل الـ AuthProvider:
      setLogin(response.data.user, token);

      return true;
    } catch (error: any) {
      console.error("فشل تسجيل الدخول:", error?.response?.data?.message || error.message);
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
