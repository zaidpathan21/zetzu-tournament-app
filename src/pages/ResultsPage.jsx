// src/pages/ResultsPage.jsx (Enhanced to show details)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../config.js';

const ResultsPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tournamentRef = ref(db, `tournaments/${id}`);
    onValue(tournamentRef, (snapshot) => {
      if (snapshot.exists()) {
        setTournament(snapshot.val());
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="loading-text">Loading Results...</div>;
  }

  if (!tournament || !tournament.winners) {
    return <div className="results-container">Results for {tournament?.title || 'this tournament'} are not yet available.</div>;
  }

  const winners = tournament.winners.sort((a, b) => a.rank - b.rank);

  return (
    <div className="results-container">
      <h2>🏆 {tournament.title} - Final Results</h2>

      {/* --- NEW: Details Card --- */}
      <div className="live-details-card results-details">
          <div className="card-stats">
              <div className="stat"><h4>💰 {tournament.prizePool}</h4><p>Prize Pool</p></div>
              {/* <div className="stat"><h4>🎯 {tournament.perKill}</h4><p>Per Kill</p></div> */}
              <div className="stat"><h4>🪙 {tournament.entryFee}</h4><p>Entry Fee</p></div>
          </div>
      </div>
      {/* --- END NEW: Details Card --- */}

      <div className="winners-list">
        {winners.map((winner) => (
          <div key={winner.rank} className={`winner-item rank-${winner.rank}`}>
            <span className="rank-badge">
              {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : winner.rank === 3 ? '🥉' : `#${winner.rank}`}
            </span>
            <strong className="winner-name">{winner.name}</strong>
            <span className="prize-amount">💰 {winner.prize}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;