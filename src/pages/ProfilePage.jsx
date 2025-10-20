// src/pages/ProfilePage.jsx (FINAL and Corrected)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../config.js';

const ProfilePage = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (!userData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2 style={{textAlign: 'center', marginBottom: '30px', color: 'var(--accent-green)'}}>
        Hey, {userData.name}!
      </h2>
      
      <div className="profile-menu">
        <div className="menu-item" onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </div>
        <div className="menu-item" onClick={() => navigate('/my-contests')}>
          Your Registrations
        </div>
        <div className="menu-item" onClick={() => navigate('/leaderboard')}>
          Leaderboard
        </div>
        <div className="menu-item" onClick={() => navigate('/transactions')}>
          Transaction History
        </div>
        <div className="menu-item" onClick={() => navigate('/privacy')}>
          Privacy Policy
        </div>
        <div className="menu-item" onClick={() => navigate('/terms')}>
          Terms & Conditions
        </div>
        <div className="menu-item" onClick={() => alert('Help & Support feature coming soon!')}>
          Help & Support
        </div>
        <div className="menu-item logout-item" onClick={handleLogout}>
          Log Out
        </div>
      </div>
    </div>
  );
}; // <-- This curly brace was likely missing in your file

export default ProfilePage;