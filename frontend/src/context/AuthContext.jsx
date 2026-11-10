import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('craver_token');
      const savedUser = localStorage.getItem('craver_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with server in background
          const freshUser = await api.getMe();
          setUser(freshUser);
          localStorage.setItem('craver_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('craver_token');
          localStorage.removeItem('craver_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('craver_token', data.token);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      address: data.address,
      phone: data.phone,
    };
    localStorage.setItem('craver_user', JSON.stringify(userData));
    setUser(userData);
    setAuthModalOpen(false);
    return userData;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('craver_token', data.token);
    const savedUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      address: data.address,
      phone: data.phone,
    };
    localStorage.setItem('craver_user', JSON.stringify(savedUser));
    setUser(savedUser);
    setAuthModalOpen(false);
    return savedUser;
  };

  const logout = () => {
    localStorage.removeItem('craver_token');
    localStorage.removeItem('craver_user');
    setUser(null);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        authModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
