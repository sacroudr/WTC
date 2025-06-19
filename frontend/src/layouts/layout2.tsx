import Sidebar from '../components/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout2: React.FC = () => {
  return (
    <>
    <div style={{  height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />
        {/* Contenu des pages */}
        <div style={{ padding: "12px", backgroundColor: "#F5F5F5", flexGrow: 1 }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout2;
