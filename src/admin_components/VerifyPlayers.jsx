// src/admin_components/VerifyPlayers.jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config.js';

// Is component ko tournament aur ek 'goBack' function props ke through milega
const VerifyPlayers = ({ tournament, goBack }) => {
    const [playerList, setPlayerList] = useState([]);
    // State to track which players are verified
    const [verifiedStatus, setVerifiedStatus] = useState({});

    useEffect(() => {
        if (tournament && tournament.players) {
            const players = Object.entries(tournament.players).map(([id, data]) => ({
                id,
                ...data
            }));
            setPlayerList(players.sort((a, b) => a.slot - b.slot));

            // Initialize verification status
            const initialStatus = {};
            players.forEach(p => {
                initialStatus[p.id] = p.verified || false;
            });
            setVerifiedStatus(initialStatus);
        }
    }, [tournament]);

    const handleVerifyToggle = async (playerId) => {
        const newStatus = !verifiedStatus[playerId];
        setVerifiedStatus(prev => ({ ...prev, [playerId]: newStatus }));
        
        // Update the verification status in Firebase
        const playerRef = ref(db, `tournaments/${tournament.id}/players/${playerId}`);
        try {
            await update(playerRef, { verified: newStatus });
        } catch (error) {
            console.error("Failed to update verification status:", error);
            // Revert state on error
            setVerifiedStatus(prev => ({ ...prev, [playerId]: !newStatus }));
        }
    };

    return (
        <div className="verify-players">
            <button className="btn-back" onClick={goBack}>&larr; Back to Tournaments</button>
            <h2>Verify Players for: {tournament.title}</h2>
            <p>Check the box for each player/team present in the correct slot in-game.</p>
            <table className="admin-table verify-table">
                <thead>
                    <tr>
                        <th>Slot #</th>
                        <th>Team / Player Name</th>
                        <th>UIDs</th>
                        <th>Verified</th>
                    </tr>
                </thead>
                <tbody>
                    {playerList.map(player => (
                        <tr key={player.id} className={verifiedStatus[player.id] ? 'verified' : ''}>
                            <td>{player.slot}</td>
                            <td>{player.teamName || player.inGameName}</td>
                            <td>
                                <ul className="uid-list">
                                    {player.inGameUID && <li>{player.inGameUID}</li>}
                                    {player.uids && Object.entries(player.uids).map(([key, uid]) => (
                                        uid && <li key={key}>{key.toUpperCase()}: {uid}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <input 
                                    type="checkbox" 
                                    className="verify-checkbox"
                                    checked={verifiedStatus[player.id] || false}
                                    onChange={() => handleVerifyToggle(player.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerifyPlayers;