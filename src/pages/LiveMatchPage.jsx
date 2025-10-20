// src/pages/LiveMatchPage.jsx (Enhanced)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../config.js';

const LiveMatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tournamentRef = ref(db, `tournaments/${id}`);
    onValue(tournamentRef, (snapshot) => {
      if (snapshot.exists()) {
        setTournament(snapshot.val());
      } else {
        console.error("Tournament not found!");
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="loading-text">Loading Match Details...</div>;
  }

  if (!tournament) {
    return <div>Tournament not found. <button onClick={() => navigate('/')}>Go Home</button></div>
  }

  const playersArray = tournament.players ? Object.values(tournament.players) : [];

  return (
    <div className="live-match-container">
      <h2>{tournament.title}</h2>
      <p className="match-status-badge">🔴 LIVE | {tournament.mode}</p>

      {/* --- NEW: Details Card --- */}
      <div className="live-details-card">
          <div className="card-stats">
              <div className="stat"><h4>💰 {tournament.prizePool}</h4><p>Prize Pool</p></div>
             {/* <div className="stat"><h4>🎯 {tournament.perKill}</h4><p>Per Kill</p></div> */}
              <div className="stat"><h4>🪙 {tournament.entryFee}</h4><p>Entry Fee</p></div>
          </div>
      </div>

      {/* --- NEW: Rules Section --- */}
      <div className="live-rules-section">
          <h3>📝 Rules</h3>
          <p>{tournament.rules || "Standard tournament rules apply. Cheating will result in immediate disqualification."}</p>
      </div>

      <div className="player-list-container">
        <h3>Joined Players ({playersArray.length} / {tournament.totalSlots})</h3>
        <ul className="player-list">
          {playersArray.length > 0 ? (
            playersArray.sort((a, b) => a.slot - b.slot).map((player, index) => (
              <li key={index} className="player-list-item">
                <span>Slot #{player.slot}</span>
                {/* Show Team Name for Squad/Duo, or Player Name for Solo */}
                <strong>{player.teamName || player.inGameName}</strong>
              </li>
            ))
          ) : (
            <p>No players have joined this tournament yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LiveMatchPage;