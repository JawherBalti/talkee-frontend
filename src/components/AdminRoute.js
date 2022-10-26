import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const user = useSelector((state) => state.user);

  return user.currentUser?.user?.role ? <Outlet /> : <Navigate to="/" />;
}
