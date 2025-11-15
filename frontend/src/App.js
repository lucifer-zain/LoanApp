import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ApplyLoan from './pages/ApplyLoan';
import MyLoans from './pages/MyLoans';
import PendingLoans from './pages/PendingLoans';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Main App Routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === 'CUSTOMER' ? <CustomerDashboard /> : <OfficerDashboard />}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/apply-loan"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <ApplyLoan />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-loans"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MyLoans />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/pending-loans"
          element={
            <ProtectedRoute allowedRoles={['OFFICER']}>
              <PendingLoans />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
