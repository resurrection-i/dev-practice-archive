import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // 未登录，重定向到登录页
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
