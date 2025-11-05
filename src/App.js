

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from './assets/theme';
// import DashboardLayout from './layouts/DashboardLayout';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// // Import pages
// import Dashboard from './pages/Dashboard';
// import JobCards from './pages/JobCards';
// import CashManagement from './pages/CashManagement';
// import GatePass from './pages/GatePass';
// import PurchaseRequisition from './pages/PurchaseRequisition';
// import JobCardView from './pages/JobCardView';
// import Login from './pages/Login';

// function ProtectedRoute({ children, allowedRoles = [] }) {
//   const { user } = useAuth();
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   }
  
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" />;
//   }
  
//   return children;
// }

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/*" element={
//               <ProtectedRoute>
//                 <DashboardLayout />
//               </ProtectedRoute>
//             } />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
// export default App;


// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './assets/theme';
import DashboardLayout from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;