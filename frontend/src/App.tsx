// // src/App.tsx
// import React from 'react';
// import { ThemeProvider, CssBaseline } from '@mui/material';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import theme from './theme';
// import Navbar from './layouts/navbar';
// import Accueil from './pages/accueil';
// import Apropos from './pages/apropos';
// import Contact from './pages/contact';

// const App: React.FC = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         {/* <Navbar /> */}
//         <Routes>
//           {/* 🔁 Redirection automatique vers /accueil */}
//           <Route path="/" element={<Navigate to="/accueil" replace />} />
          
//           {/* Page d'accueil */}
//           <Route element={<Navbar />}>
//             <Route path="/accueil" element={<Accueil />} />
//             <Route path="/a-propos" element={<Apropos />} />
//             <Route path="/contact" element={<Contact />} />
//           </Route>

//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// };

// export default App;

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
            <Route path="/super-admin" element={<Dashboard_SuperAdmin />} />
            <Route path="/client" element={<Dashboard_Client />} />
            <Route path="/back-office" element={<Dashboard_BackOffice />} />
          </Route>
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
