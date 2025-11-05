// src/pages/EditProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ref, update } from 'firebase/database';
import { db } from '../config.js';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  
  // Naye states add karein
  const [name, setName] = useState(userData?.name || '');
  const [inGameId, setInGameId] = useState(userData?.inGameId || '');
  const [whatsapp, setWhatsapp] = useState(userData?.whatsapp || '');
  const [instagram, setInstagram] = useState(userData?.instagram || '');
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name cannot be empty."); return;
    }

    const userRef = ref(db, `users/${currentUser.uid}`);
    try {
      // Naye fields ko bhi save karein
      await update(userRef, {
        name: name,
        inGameId: inGameId,
        whatsapp: whatsapp,
        instagram: instagram
      });
      alert("Profile updated successfully!");
      navigate('/profile');
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleUpdateProfile} className="edit-profile-form">
        <label htmlFor="name">Display Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" />
        
        <label htmlFor="inGameId">In-Game ID (Optional)</label>
        <input id="inGameId" type="text" value={inGameId} onChange={(e) => setInGameId(e.target.value)} placeholder="Your BGMI/FreeFire ID" />

        {/* --- NAYE INPUT FIELDS --- */}
        <label htmlFor="whatsapp">WhatsApp Number (Optional)</label>
        <input id="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="e.g., 911234567890" />
        
        <label htmlFor="instagram">Instagram Username (Optional)</label>
        <input id="instagram" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="e.g., zetzu_gaming" />
        {/* --- END NAYE FIELDS --- */}
        
        <button type="submit" className="btn-save-profile">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfilePage;