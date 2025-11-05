// src/pages/ProfilePage.jsx (FINAL - with Instagram Support Button)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../config.js';

const ProfilePage = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // --- YEH NAYA FUNCTION HAI ---
  const handleSupportClick = () => {
    // --- YAHAN APNA INSTAGRAM USERNAME DAALEIN (bina @ ke) ---
    const adminInstagramUsername = "zetzuop"; // Example: "zetzuop"
    
    // Yeh seedha aapke Instagram DMs ko kholega
    const instagramUrl = `https://ig.me/m/${adminInstagramUsername}`;
    
    // Naye tab mein Instagram kholega
    window.open(instagramUrl, '_blank');
  };

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
        
        {/* --- YEH BUTTON AB INSTAGRAM KHOLEGA --- */}
        <div className="menu-item" onClick={handleSupportClick}>
          Help & Support
        </div>
        
        <div className="menu-item logout-item" onClick={handleLogout}>
          Log Out
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;