import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Diary from './pages/Diary';
import EntryEditor from './pages/EntryEditor';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Chat from './pages/Chat';
import WeeklyReport from './pages/WeeklyReport';

function App() {
  const renderProtected = (Component) => (
    <ProtectedRoute>
      <Layout>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Landing Page & Auth Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Workspace Routes */}
            <Route path="/home" element={renderProtected(Dashboard)} />
            <Route path="/dashboard" element={renderProtected(Dashboard)} />
            <Route path="/diary" element={renderProtected(Diary)} />
            <Route path="/entry/new" element={renderProtected(EntryEditor)} />
            <Route path="/entry/:id" element={renderProtected(EntryEditor)} />
            <Route path="/goals" element={renderProtected(Goals)} />
            <Route path="/habits" element={renderProtected(Habits)} />
            <Route path="/chat" element={renderProtected(Chat)} />
            <Route path="/weekly-report" element={renderProtected(WeeklyReport)} />

            {/* Catch all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
