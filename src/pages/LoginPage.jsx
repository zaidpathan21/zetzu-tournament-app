// src/pages/LoginPage.jsx (Complete and Corrected Code)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../config.js';

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("Please fill all the fields.");
      return;
    }
    
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        name: name,
        email: email,
        wallet: 0,
        winnings: 0,
      });

      alert("Account created successfully!");
      navigate('/');
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
      
      if (userCredential) {
        try {
          await deleteUser(userCredential.user);
          console.log("Rolled back user creation from Authentication.");
        } catch (deleteError) {
          console.error("Failed to roll back user creation:", deleteError);
          alert("A ghost user might have been created. Please contact support.");
        }
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {isLoginView ? (
          <>
            <h2>Login to Zetzu</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="auth-btn" onClick={handleLogin}>Login</button>
            <p className="auth-toggle">
              Don't have an account? <span onClick={() => setIsLoginView(false)}>Sign Up</span>
            </p>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            <input type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="auth-btn" onClick={handleSignUp}>Sign Up</button>
            <p className="auth-toggle">
              Already have an account? <span onClick={() => setIsLoginView(true)}>Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;