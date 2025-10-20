// src/pages/AdminDashboardPage.jsx (FINAL and Fully Dynamic)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageRequests from '../admin_components/ManageRequests';
import ManageTournaments from '../admin_components/ManageTournaments';
import ManagePlayers from '../admin_components/ManagePlayers';
import ManageAppSettings from '../admin_components/ManageAppSettings';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('requests');

    // Security Check
    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('adminToken')) {
            navigate('/admin');
        }
    }, [navigate]);
    
    // Early return to prevent rendering before redirect
    if (typeof window !== 'undefined' && !localStorage.getItem('adminToken')) {
         return null; 
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const renderContent = () => {
        switch (activeView) {
            case 'tournaments': return <ManageTournaments />;
            case 'players': return <ManagePlayers />;
            case 'settings': return <ManageAppSettings />;
            case 'requests': default: return <ManageRequests />;
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Zetzu Admin Dashboard</h1>
                <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
            </header>
            <main className="admin-main">
                <nav className="admin-nav">
                    <div className={`admin-nav-item ${activeView === 'requests' ? 'active' : ''}`} onClick={() => setActiveView('requests')}>Manage Requests</div>
                    <div className={`admin-nav-item ${activeView === 'tournaments' ? 'active' : ''}`} onClick={() => setActiveView('tournaments')}>Tournaments</div>
                    <div className={`admin-nav-item ${activeView === 'players' ? 'active' : ''}`} onClick={() => setActiveView('players')}>Players</div>
                    <div className={`admin-nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>App Settings</div>
                </nav>
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;