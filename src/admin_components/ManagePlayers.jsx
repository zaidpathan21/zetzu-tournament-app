// src/admin_components/ManagePlayers.jsx (Updated with In-Game ID)
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config.js';

const ManagePlayers = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersRef = ref(db, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const loadedPlayers = [];
            if (data) {
                for (let id in data) {
                    loadedPlayers.push({ id, ...data[id] });
                }
            }
            setPlayers(loadedPlayers);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p>Loading player data...</p>;
    }

    return (
        <div className="manage-players">
            <h2>Player Management</h2>
            <p>A list of all registered users in your application.</p>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>In-Game ID</th> {/* <-- NAYA COLUMN */}
                        <th>Email</th>
                        <th>Contact Info</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.inGameId || 'N/A'}</td> {/* <-- NAYA DATA CELL */}
                            <td>{p.email}</td>
                            <td>
                                {p.whatsapp && (
                                    <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
                                        WhatsApp
                                    </a>
                                )}
                                {p.instagram && (
                                    <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" className="contact-link instagram">
                                        Instagram
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePlayers;