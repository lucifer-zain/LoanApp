import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isCustomer, isOfficer } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Loan Management System
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Dashboard
          </Link>
          
          {isCustomer && (
            <>
              <Link to="/apply-loan" className="navbar-link">
                Apply for Loan
              </Link>
              <Link to="/my-loans" className="navbar-link">
                My Loans
              </Link>
            </>
          )}
          
          {isOfficer && (
            <>
              <Link to="/pending-loans" className="navbar-link">
                Pending Loans
              </Link>
            </>
          )}
        </div>
        
        <div className="navbar-user">
          <span className="user-badge">
            {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
