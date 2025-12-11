import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Layout from './components/shared/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Settings from './pages/Settings';
import useAuthStore from './context/authstore';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Route */}
          <Route index element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="dashboard" 
            element={<ProtectedRoute element={<Dashboard />} />} 
          />
          <Route 
            path="scanner" 
            element={<ProtectedRoute element={<Scanner />} />} 
          />
          <Route 
            path="settings" 
            element={<ProtectedRoute element={<Settings />} />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
