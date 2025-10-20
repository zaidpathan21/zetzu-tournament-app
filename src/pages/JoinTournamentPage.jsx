// src/pages/JoinTournamentPage.jsx (FINAL and COMPLETE - Verified)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const JoinTournamentPage = () => {
  const { id } = useParams(); // Tournament's Firebase ID (e.g., tourney001)
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

  // States for all form fields
  const [soloPlayerName, setSoloPlayerName] = useState('');
  const [soloPlayerUID, setSoloPlayerUID] = useState('');
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [player1UID, setPlayer1UID] = useState('');
  const [player2UID, setPlayer2UID] = useState('');
  const [substituteUID, setSubstituteUID] = useState('');
  const [player3UID, setPlayer3UID] = useState('');
  const [player4UID, setPlayer4UID] = useState('');
  const [player5UID, setPlayer5UID] = useState('');

  useEffect(() => {
    const tournamentRef = ref(db, `tournaments/${id}`);
    const unsubscribe = onValue(tournamentRef, (snapshot) => {
      if (snapshot.exists()) {
        setTournament(snapshot.val());
      } else {
        console.error("Tournament not found!", id);
        navigate('/'); // Redirect to home if tournament ID is invalid
      }
      setLoading(false);
    });
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [id, navigate]);

  const handleJoinRequest = async () => {
    // Ensure data is loaded
    if (!tournament || !currentUser || !userData) {
      alert("Data still loading or user not logged in. Please wait.");
      return;
    }
    // Ensure teamType exists before proceeding
    const teamType = tournament.teamType?.toLowerCase();
    if (!teamType) {
      alert("Tournament data is incomplete (missing teamType).");
      return;
    }

    // Validation logic
    if (teamType === 'solo' && (!soloPlayerName.trim() || !soloPlayerUID.trim())) { alert("Please enter both your name and UID."); return; }
    if (teamType === 'duo' && (!teamName.trim() || !leaderName.trim() || !player1UID.trim() || !player2UID.trim())) { alert("Please fill all required fields for Duo entry."); return; }
    if (teamType === 'squad' && (!teamName.trim() || !leaderName.trim() || !player1UID.trim() || !player2UID.trim() || !player3UID.trim() || !player4UID.trim())) { alert("Please fill all required fields for Squad entry."); return; }
    if (!agreed) { alert("Please agree to the rules."); return; }

    // Generate payment code
    const userCode = Math.floor(1000 + Math.random() * 9000).toString();
    const paymentCode = `${tournament.uniqueCode}-${userCode}`;

    // Prepare player details object
    let playerDetails = {};
    if (teamType === 'solo') {
      playerDetails = { registeredBy: userData.name, inGameName: soloPlayerName, inGameUID: soloPlayerUID };
    } else if (teamType === 'duo') {
      playerDetails = { teamName, leaderName, uids: { p1: player1UID, p2: player2UID, sub: substituteUID } };
    } else { // Squad
      playerDetails = { teamName, leaderName, uids: { p1: player1UID, p2: player2UID, p3: player3UID, p4: player4UID, p5: player5UID } };
    }

    // Prepare request data
    const requestData = {
      tournamentId: id,
      tournamentName: tournament.title,
      entryFee: tournament.entryFee,
      userId: currentUser.uid,
      userName: userData.name,
      playerDetails: playerDetails,
      paymentCode: paymentCode,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    // Save to Firebase
    const newRequestRef = push(ref(db, 'joinRequests'));
    requestData.requestId = newRequestRef.key; // Add the generated key

    try {
      await set(newRequestRef, requestData);
      alert( `Your Join Request Submitted! Code: ${paymentCode}. Contact admin.` );
      navigate('/my-contests');
    } catch (error) {
      alert("An error occurred submitting the request.");
      console.error("Join request error:", error);
    }
  };

  // Function to render the correct form based on teamType
  const renderJoinForm = () => {
    if (!tournament || !tournament.teamType) return null;
    const teamType = tournament.teamType.toLowerCase();
    switch (teamType) {
      case 'solo':
        return ( <div className="join-form"> <input type="text" placeholder="Your In-Game Name" value={soloPlayerName} onChange={(e) => setSoloPlayerName(e.target.value)} required /> <input type="text" placeholder="Your In-Game UID" value={soloPlayerUID} onChange={(e) => setSoloPlayerUID(e.target.value)} required /> </div> );
      case 'duo':
        return ( <div className="join-form"> <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required /> <input type="text" placeholder="Leader's In-Game Name" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} required /> <hr className="form-divider" /> <input type="text" placeholder="Player 1 (Leader) UID" value={player1UID} onChange={(e) => setPlayer1UID(e.target.value)} required /> <input type="text" placeholder="Player 2 UID" value={player2UID} onChange={(e) => setPlayer2UID(e.target.value)} required /> <input type="text" placeholder="Substitute Player UID (Optional)" value={substituteUID} onChange={(e) => setSubstituteUID(e.target.value)} /> </div> );
      case 'squad':
        return ( <div className="join-form"> <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required /> <input type="text" placeholder="Leader's In-Game Name" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} required /> <hr className="form-divider" /> <input type="text" placeholder="Player 1 (Leader) UID" value={player1UID} onChange={(e) => setPlayer1UID(e.target.value)} required /> <input type="text" placeholder="Player 2 UID" value={player2UID} onChange={(e) => setPlayer2UID(e.target.value)} required /> <input type="text" placeholder="Player 3 UID" value={player3UID} onChange={(e) => setPlayer3UID(e.target.value)} required /> <input type="text" placeholder="Player 4 UID" value={player4UID} onChange={(e) => setPlayer4UID(e.target.value)} required /> <input type="text" placeholder="Player 5 UID (Substitute - Optional)" value={player5UID} onChange={(e) => setPlayer5UID(e.target.value)} /> </div> );
      default:
        return <p>Joining for this mode is not yet supported.</p>;
    }
  };

  // Loading and Error states
  if (loading) { return <div>Loading tournament details...</div>; }
  if (!tournament) { return <div>Tournament not found or failed to load. Please check the URL or go back home.</div>; }

  // Main component render
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