import Sidebar from '../components/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppBarComponent from '../components/appbar';

const Layout2: React.FC = () => {
  return (
    <>
    <div style={{  height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* AppBar */}
        <AppBarComponent />
        {/* Contenu des pages */}
          <div style={{ padding: "12px", backgroundColor: "#F5F5F5", flexGrow: 1 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout2;
