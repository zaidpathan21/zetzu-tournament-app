// src/admin_components/ManagePlayers.jsx (Simplified - No Wallet)
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
                        <th>Email</th>
                        {/* Actions column abhi ke liye khaali hai */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.email}</td>
                            <td>
                                {/* Yahan hum baad mein 'Ban User' jaisa button add kar sakte hain */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePlayers;