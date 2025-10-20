// src/components/TournamentCard.jsx (FINAL and CORRECTED)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TournamentCard = ({ tournament, isMyContest = false }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const handleJoinClick = () => { navigate(`/join-tournament/${tournament.id}`); };
  const handleViewPlayersClick = () => { navigate(`/live-match/${tournament.id}`); };
  const handleViewResultsClick = () => { navigate(`/results/${tournament.id}`); };
  const handleViewBracketClick = () => { navigate(`/bracket/${tournament.id}`); }; // Added bracket navigation

  const joinedPlayers = tournament.players ? Object.keys(tournament.players).length : 0;
  // Use `totalSlots` (camelCase) and add a fallback to 1 to prevent division by zero
  const progressPercent = (joinedPlayers / (tournament.totalSlots || 1)) * 100;
  
  const renderActionButton = () => {
    if (isMyContest) {
      return ( <button className="btn btn-details" onClick={() => setShowDetails(!showDetails)} disabled={!tournament.roomId}>{tournament.roomId ? (showDetails ? 'Hide Details' : 'Show Room Details') : 'Details Not Available'}</button> );
    }
    
    // Corrected Conditional Logic
    switch (tournament.status.toLowerCase()) {
      case 'upcoming': 
        return <button className="btn btn-join" onClick={handleJoinClick}>JOIN NOW</button>;
      case 'live': 
        return tournament.gameMode === 'Clash Squad' ? 
               <button className="btn-view-bracket" onClick={handleViewBracketClick}>View Bracket</button> :
               <button className="btn-view-players" onClick={handleViewPlayersClick}>View Players</button>;
      case 'complete': 
        return <button className="btn-results" onClick={handleViewResultsClick}>View Results</button>;
      default: 
        return null;
    }
  };

  return (
    <div className="tournament-card">
      <div className="card-header">
        <span className="tourney-code">Match #{tournament.uniqueCode}</span>
        <div className="title-container">
          <h3>{tournament.title}</h3>
        </div>
        <span className="mode-badge">{tournament.gameMode} - {tournament.teamType}</span>
      </div>

      <p className="card-date">{new Date(tournament.dateTime).toLocaleString()}</p>
      
      <div className="card-stats">
        <div className="stat"><h4>💰 {tournament.prizePool}</h4><p>Prize Pool</p></div>
        <div className="stat"><h4>🪙 {tournament.entryFee}</h4><p>Entry Fee</p></div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <div className="slot-details">
        <span>{joinedPlayers} Joined</span>
        <span>Total: {tournament.totalSlots}</span>
      </div>
      
      <div className="card-actions">
        {renderActionButton()}
      </div>

      {isMyContest && showDetails && tournament.roomId && (
        <div className="room-details">
          <p><strong>Your Slot:</strong> {tournament.slot}</p>
          <p><strong>Room ID:</strong> {tournament.roomId}</p>
          <p><strong>Password:</strong> {tournament.roomPass}</p>
        </div>
      )}
    </div>
  );
};

export default TournamentCard;