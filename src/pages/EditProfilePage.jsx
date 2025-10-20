// src/pages/EditProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ref, update } from 'firebase/database';
import { db } from '../config.js';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  // Initialize states with current user data
  const [name, setName] = useState(userData?.name || '');
  const [inGameId, setInGameId] = useState(userData?.inGameId || '');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    const userRef = ref(db, `users/${currentUser.uid}`);
    try {
      await update(userRef, {
        name: name,
        inGameId: inGameId
      });
      alert("Profile updated successfully!");
      navigate('/profile'); // Go back to the profile page
    } catch (error) {
      alert("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleUpdateProfile} className="edit-profile-form">
        <label htmlFor="name">Display Name</label>
        <input 
          id="name"
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your display name"
        />

        <label htmlFor="inGameId">In-Game ID (Optional)</label>
        <input 
          id="inGameId"
          type="text" 
          value={inGameId}
          onChange={(e) => setInGameId(e.target.value)}
          placeholder="Your FreeFire UID"
        />

        <button type="submit" className="btn-save-profile">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfilePage;