// src/components/PrivateRoute.tsx


import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // إذا المستخدم غير مسجل دخول نعيد توجيهه لصفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا مسجل دخول، نعرض المكونات الداخلية (المسار المحمي)
  return <Outlet />;
};

export default PrivateRoute;
