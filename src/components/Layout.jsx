// src/components/Layout.jsx (Final User App Version)
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
  const { userData } = useAuth();
  
  return (
    <div className="app-container">
      {/* --- UPDATED TOP HEADER --- */}
      <header className="app-header">
        <div className="welcome-text">
          {/* App Name Added Here */}
          <h1 className="app-title">ZETZU</h1> 
          <span className="welcome-player">Welcome, {userData ? userData.name : 'Player'}</span>
        </div>
        {/* <div className="wallet-balance">
          <span>💰 {userData ? userData.wallet : 0}</span>
        </div> */}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar is unchanged */}
      <nav className="bottom-nav">
        <NavLink to="/" className="nav-item">
          <span>Home</span>
        </NavLink>
        <NavLink to="/my-contests" className="nav-item">
          <span>My Contests</span>
        </NavLink>
        <NavLink to="/profile" className="nav-item">
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;