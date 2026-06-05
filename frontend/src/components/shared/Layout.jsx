// frontend/src/components/shared/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="dark min-h-screen bg-primary-bg text-text-light font-sans scan-grid">
      <NavBar />
      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;