// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ dateTime }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(dateTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
        timeLeft = { status: 'LIVE' };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (interval === 'status') return;
    if (!timeLeft[interval] && interval !== 'seconds') return;

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval.charAt(0)}
      </span>
    );
  });

  return (
    <div className="countdown-timer-bar">
      {timeLeft.status === 'LIVE' ? (
        <span className="live-now">MATCH IS LIVE!</span>
      ) : (
        <span className="starts-in">Starts in: {timerComponents.length ? timerComponents : 'Soon!'}</span>
      )}
    </div>
  );
};

export default CountdownTimer;