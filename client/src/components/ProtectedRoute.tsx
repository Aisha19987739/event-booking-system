import React from 'react';
import { Navigate } from 'react-router-dom';
import  type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // منطق التحقق من تسجيل الدخول مثلاً
  const isAuthenticated = true; // مثال فقط

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
