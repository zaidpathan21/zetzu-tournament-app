// src/admin_components/ManageRequests.jsx (FINAL - Verified)
import React, { useState, useEffect } from 'react';
import { ref, onValue, update, runTransaction, get } from 'firebase/database';
import { db } from '../config.js';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const requestsRef = ref(db, 'joinRequests');
        const unsubscribe = onValue(requestsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedRequests = [];
            if (data) {
                for (let id in data) {
                    if (data[id].status === 'Pending') {
                        loadedRequests.push({ id, ...data[id] });
                    }
                }
            }
            setRequests(loadedRequests.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAccept = async (request) => {
        const tournamentRef = ref(db, `tournaments/${request.tournamentId}`);
        runTransaction(tournamentRef, (currentData) => {
            if (!currentData) { console.error("Transaction Error: Tournament data is null!"); return; }
            const totalSlotsValue = currentData.totalSlots;
            if (typeof totalSlotsValue !== 'number' || totalSlotsValue <= 0) { console.error("Transaction Error: totalSlots invalid!"); return; }
            const takenSlots = Object.values(currentData.players || {}).map(p => p.slot);
            const allPossibleSlots = Array.from({ length: totalSlotsValue }, (_, i) => i + 1);
            const availableSlots = allPossibleSlots.filter(slot => !takenSlots.includes(slot));
            if (availableSlots.length === 0) { console.warn("Transaction Aborting: No slots."); return; }
            const randomIndex = Math.floor(Math.random() * availableSlots.length);
            const randomSlotNumber = availableSlots[randomIndex];
            if (!currentData.players) currentData.players = {};
            currentData.players[request.userId] = { ...request.playerDetails, slot: randomSlotNumber };
            return currentData;
        }).then(async (result) => {
            if (result.committed) {
                const finalTournamentData = result.snapshot.val();
                if (finalTournamentData?.players?.[request.userId]) {
                    const assignedSlot = finalTournamentData.players[request.userId].slot;
                    const requestRef = ref(db, `joinRequests/${request.id}`);
                    await update(requestRef, { status: 'Confirmed', slot: assignedSlot });
                    alert(`Accepted! Slot #${assignedSlot}.`);
                } else { alert("Couldn't confirm slot. Check DB."); }
            } else { alert("Failed: Tournament full or ID mismatch."); }
        }).catch((error) => { console.error("Transaction failed:", error); alert("Error."); });
    };

    const handleReject = async (request) => {
        const requestRef = ref(db, `joinRequests/${request.id}`);
        try {
            await update(requestRef, { status: 'Rejected' });
            alert('Request has been rejected.');
        } catch (error) {
            alert('Failed to reject request.');
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    if (loading) { return <p>Loading pending requests...</p>; }

    return (
        <div className="manage-requests">
            <h2>Pending Join Requests</h2>
            {requests.length === 0 ? (
                <p>No pending requests found.</p>
            ) : (
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Tournament</th>
                            <th>User Name</th>
                            <th>Entry Fee</th>
                            <th>Payment Code</th>
                            <th>Player Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td className="request-time">{new Date(req.timestamp).toLocaleString()}</td>
                                <td>{req.tournamentName}</td>
                                <td>{req.userName}</td>
                                <td>🪙 {req.entryFee}</td>
                                <td><strong className="payment-code">{req.paymentCode}</strong></td>
                                <td>
                                    <button className="btn-view-details" onClick={() => handleViewDetails(req)}>View Details</button>
                                </td>
                                <td>
                                    <button className="btn-accept" onClick={() => handleAccept(req)}>Accept</button>
                                    <button className="btn-reject" onClick={() => handleReject(req)}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {isModalOpen && selectedRequest && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Player Details for {selectedRequest.paymentCode}</h3>
                            <button className="close-button" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <ul className="details-list">
                                <li><strong>Tournament:</strong> {selectedRequest.tournamentName}</li>
                                <li><strong>User:</strong> {selectedRequest.userName}</li>
                                {selectedRequest.playerDetails.teamName && <li><strong>Team Name:</strong> {selectedRequest.playerDetails.teamName}</li>}
                                {selectedRequest.playerDetails.leaderName && <li><strong>Leader Name:</strong> {selectedRequest.playerDetails.leaderName}</li>}
                                <hr/>
                                
                                {selectedRequest.playerDetails.players && 
                                 Object.entries(selectedRequest.playerDetails.players).map(([key, player]) => (
                                    player.ign && player.uid && (
                                        <li key={key} className="player-detail-item">
                                            <strong>{key.toUpperCase()}:</strong>
                                            <span>{player.ign} ({player.uid})</span>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
