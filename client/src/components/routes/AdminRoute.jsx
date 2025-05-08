import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return user && user.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;