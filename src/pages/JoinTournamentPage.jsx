// src/pages/JoinTournamentPage.jsx (FINAL - with IGN and UID for all)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const JoinTournamentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

  // States for all form fields
  const [soloPlayerName, setSoloPlayerName] = useState('');
  const [soloPlayerUID, setSoloPlayerUID] = useState('');
  
  const [teamName, setTeamName] = useState('');
  //const [leaderName, setLeaderName] = useState('');

  // Player fields (P1 to P5) - IGN (In-Game Name) and UID
  const [p1_IGN, setP1_IGN] = useState('');
  const [p1_UID, setP1_UID] = useState('');
  const [p2_IGN, setP2_IGN] = useState('');
  const [p2_UID, setP2_UID] = useState('');
  const [p3_IGN, setP3_IGN] = useState('');
  const [p3_UID, setP3_UID] = useState('');
  const [p4_IGN, setP4_IGN] = useState('');
  const [p4_UID, setP4_UID] = useState('');
  const [p5_IGN, setP5_IGN] = useState(''); // Substitute
  const [p5_UID, setP5_UID] = useState(''); // Substitute

  useEffect(() => {
    const tournamentRef = ref(db, `tournaments/${id}`);
    const unsubscribe = onValue(tournamentRef, (snapshot) => {
      if (snapshot.exists()) {
        setTournament(snapshot.val());
      } else { 
        console.error("Tournament not found!", id); 
        if (!loading) navigate('/'); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, navigate, loading]);

  const handleJoinRequest = async () => {
    if (!tournament || !currentUser || !userData) { alert("Data loading or user not logged in."); return; }
    const teamType = tournament.teamType?.toLowerCase();
    if (!teamType) { alert("Tournament data incomplete."); return; }

    // --- UPDATED Validation (leaderName hata diya gaya) ---
    if (teamType === 'solo' && (!soloPlayerName.trim() || !soloPlayerUID.trim())) { alert("Please enter your In-Game Name and UID."); return; }
    if (teamType === 'duo' && (!teamName.trim() || !p1_IGN.trim() || !p1_UID.trim() || !p2_IGN.trim() || !p2_UID.trim())) { alert("Please fill all required fields for Duo entry."); return; }
    if (teamType === 'squad' && (!teamName.trim() || !p1_IGN.trim() || !p1_UID.trim() || !p2_IGN.trim() || !p2_UID.trim() || !p3_IGN.trim() || !p3_UID.trim() || !p4_IGN.trim() || !p4_UID.trim())) { alert("Please fill all required fields for Squad entry."); return; }
    if (!agreed) { alert("Please agree to the rules."); return; }

    const userCode = Math.floor(1000 + Math.random() * 9000).toString();
    const paymentCode = `${tournament.uniqueCode}-${userCode}`;
    let playerDetails = {};

    // --- UPDATED Player Details Object (leaderName ab p1_IGN hai) ---
    if (teamType === 'solo') {
      playerDetails = { 
        registeredBy: userData.name, 
        players: { p1: { ign: soloPlayerName, uid: soloPlayerUID } }
      };
    } else if (teamType === 'duo') {
      playerDetails = { 
        teamName, leaderName: p1_IGN, // <-- FIX: Leader Name ab P1 ka IGN hai
        players: {
          p1: { ign: p1_IGN, uid: p1_UID },
          p2: { ign: p2_IGN, uid: p2_UID },
          sub: { ign: p5_IGN, uid: p5_UID }
        }
      };
    } else { // Squad
      playerDetails = { 
        teamName, leaderName: p1_IGN, // <-- FIX: Leader Name ab P1 ka IGN hai
        players: {
          p1: { ign: p1_IGN, uid: p1_UID },
          p2: { ign: p2_IGN, uid: p2_UID },
          p3: { ign: p3_IGN, uid: p3_UID },
          p4: { ign: p4_IGN, uid: p4_UID },
          p5: { ign: p5_IGN, uid: p5_UID }
        }
      };
    }

    const requestData = {
      requestId: null, tournamentId: id, tournamentName: tournament.title,
      entryFee: tournament.entryFee, userId: currentUser.uid, userName: userData.name,
      playerDetails: playerDetails, paymentCode: paymentCode, status: 'Pending',
      timestamp: new Date().toISOString()
    };
    
    const newRequestRef = push(ref(db, 'joinRequests'));
    requestData.requestId = newRequestRef.key;
    try {
      await set(newRequestRef, requestData);
      alert( `Join Request Submitted! Code: ${paymentCode}. Contact admin.` );
      navigate('/my-contests');
    } catch (error) {
      alert("Error submitting request."); console.error("Join request error:", error);
    }
  };

  // --- UPDATED Render Join Form ---
  const renderJoinForm = () => {
    if (!tournament || !tournament.teamType) return null;
    const teamType = tournament.teamType.toLowerCase();
    switch (teamType) {
      case 'solo':
        return (
          <div className="join-form">
            <input type="text" placeholder="Your In-Game Name" value={soloPlayerName} onChange={(e) => setSoloPlayerName(e.target.value)} required />
            <input type="text" placeholder="Your In-Game UID" value={soloPlayerUID} onChange={(e) => setSoloPlayerUID(e.target.value)} required />
          </div>
        );
      case 'duo':
        return (
          <div className="join-form">
            <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
            {/* <input type="text" placeholder="Leader's In-Game Name" ... />  <-- YEH HATA DIYA GAYA HAI */}
            <hr className="form-divider" />
            <h5>Player 1 (Leader)</h5>
            <input type="text" placeholder="Player 1 In-Game Name" value={p1_IGN} onChange={(e) => setP1_IGN(e.target.value)} required />
            <input type="text" placeholder="Player 1 UID" value={p1_UID} onChange={(e) => setP1_UID(e.target.value)} required />
            <hr className="form-divider-light" />
            <h5>Player 2</h5>
            <input type="text" placeholder="Player 2 In-Game Name" value={p2_IGN} onChange={(e) => setP2_IGN(e.target.value)} required />
            <input type="text" placeholder="Player 2 UID" value={p2_UID} onChange={(e) => setP2_UID(e.target.value)} required />
            <hr className="form-divider-light" />
            <h5>Substitute (Optional)</h5>
            <input type="text" placeholder="Substitute In-Game Name" value={p5_IGN} onChange={(e) => setP5_IGN(e.target.value)} />
            <input type="text" placeholder="Substitute UID" value={p5_UID} onChange={(e) => setP5_UID(e.target.value)} />
          </div>
        );
      case 'squad':
        return (
          <div className="join-form">
            <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
            {/* <input type="text" placeholder="Leader's In-Game Name" ... />  <-- YEH HATA DIYA GAYA HAI */}
            <hr className="form-divider" />
            <h5>Player 1 (Leader)</h5>
            <input type="text" placeholder="Player 1 In-Game Name" value={p1_IGN} onChange={(e) => setP1_IGN(e.target.value)} required />
            <input type="text" placeholder="Player 1 UID" value={p1_UID} onChange={(e) => setP1_UID(e.target.value)} required />
            <hr className="form-divider-light" />
            <h5>Player 2</h5>
            <input type="text" placeholder="Player 2 In-Game Name" value={p2_IGN} onChange={(e) => setP2_IGN(e.target.value)} required />
            <input type="text" placeholder="Player 2 UID" value={p2_UID} onChange={(e) => setP2_UID(e.target.value)} required />
            <hr className="form-divider-light" />
            <h5>Player 3</h5>
            <input type="text" placeholder="Player 3 In-Game Name" value={p3_IGN} onChange={(e) => setP3_IGN(e.target.value)} required />
            <input type="text" placeholder="Player 3 UID" value={p3_UID} onChange={(e) => setP3_UID(e.target.value)} required />
            <hr className="form-divider-light" />
            <h5>Player 4</h5>
            <input type="text" placeholder="Player 4 In-Game Name" value={p4_IGN} onChange={(e) => setP4_IGN(e.target.value)} required />
            <input type="text" placeholder="Player 4 UID" value={p4_UID} onChange={(e) => setP4_UID(e.target.value)} required />
            <hr className="form-divider-light" />
            <h5>Player 5 (Substitute - Optional)</h5>
            <input type="text" placeholder="Substitute In-Game Name" value={p5_IGN} onChange={(e) => setP5_IGN(e.target.value)} />
            <input type="text" placeholder="Substitute UID" value={p5_UID} onChange={(e) => setP5_UID(e.target.value)} />
          </div>
        );
      default:
        return <p>Joining for this mode is not yet supported.</p>;
    }
  };

  if (loading) { return <div>Loading...</div>; }
  if (!tournament) { return <div>Tournament not found</div>; }

  return (
    <div className="join-page-container">
      <h2>{tournament.title}</h2>
      <div className="rules-section">
        <h3>📝 Rules & Regulations</h3>
        <p>{tournament.rules || "Standard tournament rules apply."}</p>
      </div>
      <div className="player-details-section">
        <h3>👥 Player Details ({tournament.gameMode} - {tournament.teamType})</h3>
        {renderJoinForm()}
      </div>
      <div className="agree-section">
        <input type="checkbox" id="agree" checked={agreed} onChange={() => setAgreed(!agreed)} />
        <label htmlFor="agree">I have read and agree to all tournament rules.</label>
      </div>
      <button className="btn-final-join" disabled={!agreed} onClick={handleJoinRequest}>
        Submit Join Request
      </button>
    </div>
  );
};

export default JoinTournamentPage;