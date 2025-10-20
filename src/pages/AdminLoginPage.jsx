// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Yeh aapke secret admin credentials hain. Aap inhein baad mein badal sakte hain.
const ADMIN_EMAIL = "admin@zetzu.com";
const ADMIN_PASSWORD = "adminpassword123";

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = (e) => {
        e.preventDefault();
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Browser mein ek "token" save kar dein taaki aap logged in rahen
            localStorage.setItem('adminToken', 'true');
            navigate('/admin/dashboard');
        } else {
            alert('Invalid Admin Credentials!');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box admin-box">
                <h2>Zetzu Admin Login</h2>
                <form onSubmit={handleAdminLogin}>
                    <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="auth-btn">Log In</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;