import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');

    // Ila s-sarout ma-kaynch, radd l-user l-page d l-login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Ila s-sarout kayn, khallih i-chouf l-page (children)
    return children;
};

export default ProtectedRoute;