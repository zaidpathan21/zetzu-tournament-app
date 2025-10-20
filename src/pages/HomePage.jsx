// src/pages/HomePage.jsx (Complete and Corrected Code)
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config.js';
import TournamentCard from '../components/TournamentCard';
import { useAuth } from '../context/AuthContext.jsx';
import CountdownTimer from '../components/CountdownTimer.jsx'; // <-- FIX APPLIED HERE

const HomePage = () => {
  const [allTournaments, setAllTournaments] = useState([]);
  const [appSettings, setAppSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Fetch Tournaments
    const tournamentsRef = ref(db, 'tournaments');
    onValue(tournamentsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTournaments = [];
      if (data) {
        for (let id in data) {
          loadedTournaments.push({ id, ...data[id] });
        }
      }
      setAllTournaments(loadedTournaments);
    });

    // Fetch App Settings
    const settingsRef = ref(db, 'appSettings');
    onValue(settingsRef, (snapshot) => {
      setAppSettings(snapshot.val() || {});
      setLoading(false); 
    });

  }, []);

  const filteredTournaments = allTournaments.filter(
    (tournament) => tournament.status.toLowerCase() === activeTab
  );

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  const firstBannerUrl = appSettings.banners ? Object.values(appSettings.banners)[0] : null;

  return (
    <div className="home-page">
      
      {/* Banner Slider */}
      {firstBannerUrl && (
        <div className="banner-slider">
          <img src={firstBannerUrl} alt="Promotion Banner" />
        </div>
      )}

      {/* Announcement Bar */}
      {appSettings.announcement && (
        <div className="announcement-bar">
          <span className="announcement-icon">📣</span>
          <marquee>{appSettings.announcement}</marquee>
        </div>
      )}
      
      <div className="tournament-tabs">
        <button 
          className={`tab-link ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab-link ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live
        </button>
        <button 
          className={`tab-link ${activeTab === 'complete' ? 'active' : ''}`}
          onClick={() => setActiveTab('complete')}
        >
          Complete
        </button>
      </div>

      <div className="tournaments-list">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament) => (
            <div key={tournament.id}>
                {/* Countdown for Upcoming Matches */}
                {tournament.status.toLowerCase() === 'upcoming' && (
                    <CountdownTimer dateTime={tournament.dateTime} />
                )}
                <TournamentCard tournament={tournament} />
            </div>
          ))
        ) : (
          <p>No {activeTab} tournaments found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;