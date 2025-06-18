// src/App.tsx
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import theme from './theme';
import Navbar from './layouts/navbar';
import Accueil from './pages/accueil';
import Apropos from './pages/apropos';
import Contact from './pages/contact';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />

        <Routes>
          {/* 🔁 Redirection automatique vers /accueil */}
          <Route path="/" element={<Navigate to="/accueil" replace />} />
          
          {/* Page d'accueil */}
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/a-propos" element={<Apropos />} />
          <Route path="/contact" element={<Contact />} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
