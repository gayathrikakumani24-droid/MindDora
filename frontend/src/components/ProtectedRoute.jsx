import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400 text-sm">Syncing with MindDora second brain...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
