import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../services/api';

export default function RequireAuth({ children }) {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/pages/signin" replace state={{ from: location }} />;
  }

  return children;
}

