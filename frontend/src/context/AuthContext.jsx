import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('minddora_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('minddora_token');
      }
    } catch (error) {
      console.error('Error fetching auth user profile:', error);
      localStorage.removeItem('minddora_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('minddora_token', data.token);
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('minddora_token', data.token);
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const googleLogin = async (token, devEmail = null, devName = null) => {
    try {
      const { data } = await API.post('/auth/google', { token, email: devEmail, name: devName });
      if (data.success) {
        localStorage.setItem('minddora_token', data.token);
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('minddora_token');
    setUser(null);
  };

  const updateMentorPreference = async (mentorPreference) => {
    try {
      const { data } = await API.put('/auth/me/mentor', { mentorPreference });
      if (data.success) {
        setUser((prev) => ({ ...prev, mentorPreference: data.mentorPreference }));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update mentor preference',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
        updateMentorPreference,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
