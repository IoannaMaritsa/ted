// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext'; // Adjust path as needed

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { isLoggedIn } = useAppContext();

    return isLoggedIn ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
