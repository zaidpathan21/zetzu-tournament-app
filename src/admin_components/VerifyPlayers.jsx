// src/admin_components/VerifyPlayers.jsx (FINAL - Handles ALL Data Structures)
import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config.js';

const VerifyPlayers = ({ tournament, goBack }) => {
    const [playerList, setPlayerList] = useState([]);
    const [verifiedStatus, setVerifiedStatus] = useState({});

    useEffect(() => {
        if (tournament && tournament.players) {
            const players = Object.entries(tournament.players).map(([id, data]) => ({
                id,
                ...data
            }));
            setPlayerList(players.sort((a, b) => a.slot - b.slot));

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
        
        const playerRef = ref(db, `tournaments/${tournament.id}/players/${playerId}`);
        try {
            await update(playerRef, { verified: newStatus });
        } catch (error) {
            console.error("Failed to update verification status:", error);
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
                        <th>UIDs & In-Game Names</th>
                        <th>Verified</th>
                    </tr>
                </thead>
                {/* --- YEH RAHA FIX (tbody) --- */}
                <tbody>
                    {playerList.map(player => (
                        <tr key={player.id} className={verifiedStatus[player.id] ? 'verified' : ''}>
                            <td>{player.slot}</td>
                            {/* Team name (for Duo/Squad) ya P1 ka IGN (for Solo) dikhayein */}
                            <td>{player.teamName || player.players?.p1?.ign || player.inGameName}</td>
                            <td>
                                <ul className="uid-list">
                                    {/* Naya Structure (Duo/Squad/New Solo) */}
                                    {player.players &&
                                     Object.entries(player.players).map(([key, pData]) => (
                                        pData.ign && pData.uid && (
                                            <li key={key}>
                                                <strong>{key.toUpperCase()}:</strong> {pData.ign} ({pData.uid})
                                            </li>
                                        )
                                    ))}
                                    
                                    {/* Puraana Solo Structure (Backup) */}
                                    {player.inGameName && player.inGameUID && (
                                        <li>
                                            <strong>P1:</strong> {player.inGameName} ({player.inGameUID})
                                        </li>
                                    )}
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
                {/* --- FIX KHATAM --- */}
            </table>
        </div>
    );
};

export default VerifyPlayers;