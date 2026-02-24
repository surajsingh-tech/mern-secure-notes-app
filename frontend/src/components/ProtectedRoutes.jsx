import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { getData, UserContext } from '@/context/userContext';

export default function ProtectedRoutes({ children }) {
  const { user } = getData();
  console.log("user ", user);

  return user ? children : <Navigate to="/login" replace />;
}