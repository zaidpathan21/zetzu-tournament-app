// src/pages/MyContestsPage.jsx (FINAL - With Placeholder Room ID/Pass)
import React, { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, onValue, get } from 'firebase/database';
import { db } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

const MyContestsPage = () => {
  const { currentUser } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const requestsRef = query(ref(db, 'joinRequests'), orderByChild('userId'), equalTo(currentUser.uid));

    const unsubscribe = onValue(requestsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setMyRequests([]);
        setLoading(false);
        return;
      }

      const requestsData = [];
      snapshot.forEach(childSnapshot => {
        requestsData.push(childSnapshot.val());
      });

      const detailedRequestsPromises = requestsData.map(async (request) => {
        if (request.status === 'Confirmed') {
          const tournamentRef = ref(db, `tournaments/${request.tournamentId}`);
          const tournamentSnapshot = await get(tournamentRef);
          if (tournamentSnapshot.exists()) {
            const tournamentData = tournamentSnapshot.val();
            return { 
              ...request,
              roomId: tournamentData.roomId,
              roomPass: tournamentData.roomPass
            };
          }
        }
        return request;
      });

      const detailedRequests = await Promise.all(detailedRequestsPromises);
      setMyRequests(detailedRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <div>Loading your contests...</div>;
  }

  return (
    <div className="my-contests-page">
      <h2>Your Tournament Registrations</h2>
      {myRequests.length > 0 ? (
        myRequests.map(request => (
          <div key={request.requestId} className="request-card">
            <h3>{request.tournamentName}</h3>
            <p>Payment Code: <strong>{request.paymentCode}</strong></p>
            <p>Status: <span className={`status-${request.status.toLowerCase()}`}>{request.status}</span></p>
            
            {request.status === 'Confirmed' && (
              <div className="confirmed-details">
                <p>Your Slot: <strong>#{request.slot}</strong></p>
                
                {/* --- YEH HAI NAYA LOGIC --- */}
                {request.roomId ? (
                  <>
                    <p>Room ID: <strong>{request.roomId}</strong></p>
                    <p>Password: <strong>{request.roomPass}</strong></p>
                  </>
                ) : (
                  <>
                    <p>Room ID: <strong>*******</strong></p>
                    <p>Password: <strong>*******</strong></p>
                  </>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>You haven't requested to join any tournaments yet.</p>
      )}
    </div>
  );
};

export default MyContestsPage;