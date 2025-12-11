// frontend/src/components/shared/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="dark min-h-screen bg-primary-bg text-text-light font-sans">
      <main className="container mx-auto px-4 py-8">
        {children || <Outlet />} 
      </main>
    </div>
  );
};

export default Layout;