// src/App.tsx
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import theme from './theme';
import Layout from './layouts/layout'; // ✅ nouveau layout

import Accueil from './pages/accueil';
import Apropos from './pages/apropos';
import Contact from './pages/contact';
import LoginPage from './pages/login'; // si tu l’as déjà
import Dashboard_SuperAdmin from './pages/super-admin/dashboard';
import Dashboard_Client from './pages/client/dashboard';
import Dashboard_BackOffice from './pages/back-office/dashboard';
import Layout2 from './layouts/layout2';
import RegisterPage from './pages/register';
import Utilisateurs_BackOffice from './pages/back-office/chauffeurs';
import Camions_BackOffice from './pages/back-office/camions';
import Livraisons_BackOffice from './pages/back-office/livraisons';
import Livraison_Client from './pages/client/livraisons';
import Utilisateur_SuperAdmin from './pages/super-admin/utilisateurs';
import Livraison_SuperAdmin from './pages/super-admin/livraison';
import Camion_SuperAdmin from './pages/super-admin/camions';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 🔁 Redirection vers accueil */}
          <Route path="/" element={<Navigate to="/accueil" replace />} />
          
          {/* Page de login (sans layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Pages avec navbar */}
          <Route element={<Layout />}>
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/a-propos" element={<Apropos />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          
          <Route element={<Layout2 />}>
            <Route path="/dashboard_super-admin" element={<Dashboard_SuperAdmin />} />
            <Route path="/dashboard_client" element={<Dashboard_Client />} />
            <Route path="/dashboard_back-office" element={<Dashboard_BackOffice />} />
            
            <Route path="/utilisateurs_back-office" element={<Utilisateurs_BackOffice />} />
            <Route path="/camions_back-office" element={<Camions_BackOffice />} />
            <Route path="/livraisons_back-office" element={<Livraisons_BackOffice />} />

            <Route path="/livraisons_client" element={<Livraison_Client />} />

            <Route path="/utilisateurs_super-admin" element={<Utilisateur_SuperAdmin />} />
            <Route path="/camions_super-admin" element={<Camion_SuperAdmin />} />
            <Route path="/livraisons_super-admin" element={<Livraison_SuperAdmin />} />
          </Route>
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
