// src/pages/BracketViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const BracketViewPage = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userSlot, setUserSlot] = useState(null);
    const [userTeamName, setUserTeamName] = useState(null);

    useEffect(() => {
        const tournamentRef = ref(db, `tournaments/${id}`);
        const unsubscribe = onValue(tournamentRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setTournament(data);
                const playerEntry = Object.entries(data.players || {}).find(([uid]) => uid === currentUser.uid);
                if (playerEntry) {
                    setUserSlot(playerEntry[1].slot);
                    setUserTeamName(playerEntry[1].teamName || playerEntry[1].inGameName);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id, currentUser]);

    if (loading) return <div className="loading-text">Loading Bracket...</div>;
    if (!tournament || !tournament.bracket) return <div>Bracket not available.</div>;

    const getTeamNameBySlot = (slot) => {
        const playerEntry = Object.values(tournament.players || {}).find(p => p.slot === slot);
        return playerEntry ? (playerEntry.teamName || `Slot ${slot}`) : `Slot ${slot}`;
    };

    const renderUserMatchView = (roundName) => {
         const round = tournament.bracket?.[roundName];
         if (!round) return null;
         return Object.entries(round).map(([matchKey, match]) => {
            const teamA_name = roundName === 'round1' ? getTeamNameBySlot(match.teams.teamA_slot) : (match.teams.teamA || 'TBD');
            const teamB_name = roundName === 'round1' ? getTeamNameBySlot(match.teams.teamB_slot) : (match.teams.teamB || 'TBD');
            let isUserPlaying = false;
            if (roundName === 'round1' && userSlot) isUserPlaying = (match.teams.teamA_slot === userSlot || match.teams.teamB_slot === userSlot);
            else if (roundName !== 'round1' && userTeamName) isUserPlaying = (match.teams.teamA === userTeamName || match.teams.teamB === userTeamName);
            return (
                <div key={matchKey} className={`user-bracket-match ${isUserPlaying ? 'user-match' : ''}`}>
                    <h4>{matchKey.replace('match', 'Match ')} ({match.status})</h4>
                    <div className="match-teams">
                        <span className={match.winner === teamA_name ? 'winner' : ''}>{teamA_name}</span>
                        <span className="vs">vs</span>
                        <span className={match.winner === teamB_name ? 'winner' : ''}>{teamB_name}</span>
                    </div>
                    {match.status === 'Complete' && match.winner && <p className="winner-text">🏆 Winner: {match.winner}</p>}
                    {isUserPlaying && (match.status === 'Upcoming' || match.status === 'Live') && match.roomId && (
                        <div className="user-room-details">
                            <p><strong>Room ID:</strong> {match.roomId}</p>
                            <p><strong>Password:</strong> {match.roomPass}</p>
                        </div>
                    )}
                     {isUserPlaying && (match.status === 'Upcoming' || match.status === 'Live') && !match.roomId && <p className="details-pending">Room details soon...</p>}
                </div>
            );
         });
    };

    return (
        <div className="bracket-view-container">
            <h2>{tournament.title} - Bracket</h2>
             <p className="match-status-badge">{tournament.status === 'Live' ? '🔴 LIVE' : tournament.status}</p>
            <div className="user-bracket-round">
                <h3>Round 1</h3>
                {renderUserMatchView('round1')}
            </div>
            {tournament.bracket?.finals && (
                 <div className="user-bracket-round">
                    <h3>Finals</h3>
                    {renderUserMatchView('finals')}
                </div>
            )}
        </div>
    );
};
export default BracketViewPage;