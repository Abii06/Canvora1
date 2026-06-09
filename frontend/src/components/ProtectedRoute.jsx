import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth', { state: { from: location.pathname } });
        }
    }, [isAuthenticated, navigate, location.pathname]);

    if (!isAuthenticated) {
        return null; // or a loading spinner while redirecting
    }

    return children;
};

export default ProtectedRoute;
