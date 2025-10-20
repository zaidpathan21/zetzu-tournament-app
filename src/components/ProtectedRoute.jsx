// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user is logged in, redirect to the /login page
    return <Navigate to="/login" />;
  }

  return children; // If user is logged in, show the page
};

export default ProtectedRoute;