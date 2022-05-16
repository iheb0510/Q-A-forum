import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const signIn = useSelector((state) => state.auth);
  const { isAuthenticated } = signIn;
  return isAuthenticated ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
