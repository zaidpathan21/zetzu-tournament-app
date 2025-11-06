// src/admin_components/ManageTournaments.jsx (Simple Edit Button Version)
import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push, update, remove } from 'firebase/database';
import { db } from '../config.js';
import VerifyPlayers from './VerifyPlayers'; // Yeh abhi bhi kaam aayega

const ManageTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState(null);
    
    const [newTournament, setNewTournament] = useState({
        title: '', uniqueCode: '', gameMode: 'Classic', teamType: 'Solo',
        dateTime: '', prizePool: 0, entryFee: 0, totalSlots: 0,
        status: 'Upcoming', rules: ''
    });

    const [playerList, setPlayerList] = useState([]);
    const [selectedWinner, setSelectedWinner] = useState('');

    // --- View Mode State (Verify Players ke liye) ---
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'verify'
    const [selectedTournament, setSelectedTournament] = useState(null);

    useEffect(() => {
        const tournamentsRef = ref(db, 'tournaments');
        const unsubscribe = onValue(tournamentsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedTournaments = [];
            if (data) {
                for (let id in data) {
                    loadedTournaments.push({ id, ...data[id] });
                }
            }
            setTournaments(loadedTournaments.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        // Bracket ya Clash Squad se juda koi bhi special logic yahan nahi hai
        setNewTournament(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        if (!newTournament.title || !newTournament.uniqueCode || !newTournament.dateTime) {
            alert('Title, Unique Code, and Date/Time are required.'); return;
        }
        const newTournamentRef = push(ref(db, 'tournaments'));
        let tournamentData = {
            title: newTournament.title,
            uniqueCode: newTournament.uniqueCode,
            gameMode: newTournament.gameMode,
            teamType: newTournament.teamType,
            dateTime: newTournament.dateTime,
            prizePool: Number(newTournament.prizePool),
            entryFee: Number(newTournament.entryFee),
            totalSlots: Number(newTournament.totalSlots),
            status: 'Upcoming',
            rules: newTournament.rules
            // Bracket ka koi data save nahi hoga
        };
        try {
            await set(newTournamentRef, tournamentData);
            alert('Tournament created successfully!');
            setShowCreateForm(false);
        } catch (error) {
            alert('Failed to create tournament.');
        }
    };
    
    const openEditModal = (t) => { 
        setEditingTournament(t); 
        setIsEditModalOpen(true); 
        // Winner select karne ke liye players fetch karein
        if (t.players) { 
            setPlayerList(Object.values(t.players)); 
        } 
    };
    const closeEditModal = () => { setIsEditModalOpen(false); setEditingTournament(null); setPlayerList([]); setSelectedWinner(''); };
    const handleEditInputChange = (e) => { const { name, value } = e.target; const updated = { ...editingTournament, [name]: value }; setEditingTournament(updated); };
    
    const handleUpdateTournament = async (e) => { 
        e.preventDefault(); 
        const tRef = ref(db, `tournaments/${editingTournament.id}`); 
        try { 
            await update(tRef, { 
                title: editingTournament.title, 
                status: editingTournament.status, 
                rules: editingTournament.rules || "", 
                roomId: editingTournament.roomId || "", 
                roomPass: editingTournament.roomPass || "" 
            }); 
            alert('Tournament updated!'); 
            closeEditModal(); 
        } catch (error) { alert('Failed to update.'); } 
    };
    
    const handleDeclareWinner = async () => { 
        if (!selectedWinner) { alert("Please select a winner."); return; } 
        const winnerData = JSON.parse(selectedWinner); 
        const tRef = ref(db, `tournaments/${editingTournament.id}`); 
        try { 
            await update(tRef, { 
                status: 'Complete', 
                winners: [{ rank: 1, name: winnerData.teamName || winnerData.playerDetails.players.p1.ign, prize: editingTournament.prizePool }] 
            }); 
            alert(`Winner declared!`); 
            closeEditModal(); 
        } catch (error) { alert("Failed to declare winner."); } 
    };
    
    const handleDeleteTournament = async (id) => { if (window.confirm("Sure?")) { await remove(ref(db, `tournaments/${id}`)); alert('Deleted.'); } };
    const handleVerifyClick = (t) => { setSelectedTournament(t); setViewMode('verify'); };
    
    if (loading) return <p>Loading tournaments...</p>;
    if (viewMode === 'verify') return <VerifyPlayers tournament={selectedTournament} goBack={() => setViewMode('list')} />;

    // Bracket view ka logic hata diya gaya hai
    
    return (
        <div className="manage-tournaments">
            <h2>Tournament Management</h2>
            <button className="btn-create-new" onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : '+ Create New Tournament'}
            </button>

            {showCreateForm && (
                <form className="create-tournament-form" onSubmit={handleCreateTournament}>
                    <h3>Create New Tournament</h3>
                    <input name="title" onChange={handleCreateInputChange} placeholder="Tournament Title" required />
                    <input name="uniqueCode" onChange={handleCreateInputChange} placeholder="Unique Match Code" required />
                    <select name="gameMode" onChange={handleCreateInputChange} value={newTournament.gameMode}>
                        <option value="Classic">Classic</option>
                        <option value="Clash Squad">Clash Squad</option>
                    </select>
                    <select name="teamType" onChange={handleCreateInputChange} value={newTournament.teamType}>
                        <option value="Solo">Solo</option>
                        <option value="Duo">Duo</option>
                        <option value="Squad">Squad</option>
                    </select>
                    {/* Bracket size ka input hata diya gaya hai */}
                    <input name="dateTime" type="datetime-local" onChange={handleCreateInputChange} required />
                    <input name="prizePool" type="number" onChange={handleCreateInputChange} placeholder="Prize Pool" required />
                    <input name="entryFee" type="number" onChange={handleCreateInputChange} placeholder="Entry Fee" required />
                    <input name="totalSlots" type="number" onChange={handleCreateInputChange} placeholder="Total Slots" required />
                    <textarea name="rules" onChange={handleCreateInputChange} placeholder="Enter tournament rules..." rows="4"></textarea>
                    <button type="submit">Create Tournament</button>
                </form>
            )}

            <h3>All Tournaments</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Match Code</th>
                        <th>Game Mode</th>
                        <th>Team Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map(t => (
                        <tr key={t.id}>
                            <td>{t.title}</td>
                            <td>{t.uniqueCode}</td>
                            <td>{t.gameMode}</td>
                            <td>{t.teamType}</td>
                            <td>{t.status}</td>
                            <td>
                                {/* --- UPDATED: Hamesha "Edit" button dikhega --- */}
                                <button className="btn-edit" onClick={() => openEditModal(t)}>Edit</button>
                                
                                {t.status === 'Live' && (
                                    <button className="btn-verify" onClick={() => handleVerifyClick(t)}>Verify</button>
                                )}
                                <button className="btn-delete" onClick={() => handleDeleteTournament(t.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {isEditModalOpen && editingTournament && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Tournament: {editingTournament.title}</h3>
                            <button className="close-button" onClick={closeEditModal}>&times;</button>
                        </div>
                        {/* --- YEH PURANA SIMPLE EDIT MODAL HAI --- */}
                        <div className="modal-body">
                            <label>Title</label>
                            <input name="title" value={editingTournament.title} onChange={handleEditInputChange} />
                             <label>Rules</label>
                            <textarea name="rules" value={editingTournament.rules || ''} onChange={handleEditInputChange} rows="4"></textarea>
                            <label>Status</label>
                            <select name="status" value={editingTournament.status} onChange={handleEditInputChange}>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Live">Live</option>
                                <option value="Complete">Complete</option>
                            </select>

                            {editingTournament.status === 'Live' && (
                                <>
                                    <label>Room ID</label>
                                    <input name="roomId" value={editingTournament.roomId || ''} onChange={handleEditInputChange} placeholder="Enter Room ID" />
                                    <label>Room Password</label>
                                    <input name="roomPass" value={editingTournament.roomPass || ''} onChange={handleEditInputChange} placeholder="Enter Room Password" />
                                    <button type="button" className="btn-save-changes" onClick={handleUpdateTournament}>Save Changes</button>
                                </>
                            )}
                            {editingTournament.status === 'Complete' && (
                                <>
                                    <label>Select Winner</label>
                                    {playerList.length > 0 ? (
                                        <select value={selectedWinner} onChange={(e) => setSelectedWinner(e.target.value)}>
                                            <option value="">-- Select a Winner --</option>
                                            {playerList.map((player, index) => (
                                                <option key={index} value={JSON.stringify(player)}>
                                                    Slot #{player.slot} - {player.teamName || player.playerDetails.players.p1.ign}
                                                </option>
                                            ))}
                                        </select>
                                    ) : <p>No players joined this tournament.</p>}
                                    <button type="button" className="btn-save-changes" onClick={handleDeclareWinner}>Declare Winner</button>
                                </>
                            )}
                            {editingTournament.status === 'Upcoming' && (
                                <button type="button" className="btn-save-changes" onClick={handleUpdateTournament}>Save Changes</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTournaments;