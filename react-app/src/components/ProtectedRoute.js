// src/components/ProtectedRoute.js
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext'; // Adjust path as needed

const ProtectedRoute = ({ element: Component, requiredRole,  ...rest }) => {
    const { isLoggedIn, loading } = useAppContext();


    if (loading) {
        // Show a loading spinner or placeholder while loading
        return <div></div>;
    }

    const token = localStorage.getItem("token");


    if (!token) {
        // Redirect to login if not logged in
        return <Navigate to="/login" />;
    }

    const decoded = jwtDecode(token);
    console.log("token", decoded)

    if (requiredRole === "user" && decoded.role ==="admin") {
        return <Navigate to="/admin" />;
    }
    if (requiredRole === "admin"  && decoded.role ==="user") {
        return <Navigate to="/epaggelmatias_homepage" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
