import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Check local storage for initial state to persist login across reloads
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuth') === 'true';
    });

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const login = async (formData, navigate, redirectPath = '/collections') => {
        try {
            const { data } = await api.login(formData);
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('isAuth', 'true');
            navigate(redirectPath);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const register = async (formData, navigate, redirectPath = '/collections') => {
        try {
            const { data } = await api.register(formData);
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('isAuth', 'true');
            navigate(redirectPath);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuth');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
