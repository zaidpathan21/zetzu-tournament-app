// src/pages/AdminDashboardPage.jsx (FINAL - Fully Functional)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageRequests from '../admin_components/ManageRequests';
import ManageTournaments from '../admin_components/ManageTournaments';
import ManagePlayers from '../admin_components/ManagePlayers';
import ManageAppSettings from '../admin_components/ManageAppSettings';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('requests');
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            navigate('/admin');
        }
    }, [navigate]);

    if (!localStorage.getItem('adminToken')) {
         return null; 
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    // --- YEH FUNCTION ADHOORA THA ---
    const renderContent = () => {
        switch (activeView) {
            case 'tournaments':
                return <ManageTournaments />;
            case 'players':
                return <ManagePlayers />;
            case 'settings':
                return <ManageAppSettings />;
            case 'requests':
            default:
                return <ManageRequests />;
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <button className="admin-menu-btn" onClick={() => setIsNavOpen(true)}>☰</button>
                <h1>Zetzu Admin Dashboard</h1>
                <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
            </header>
            <main className="admin-main">
                <div className={`admin-nav-overlay ${isNavOpen ? 'open' : ''}`} onClick={() => setIsNavOpen(false)}></div>
                <nav className={`admin-nav ${isNavOpen ? 'open' : ''}`}>
                    <button className="admin-nav-close-btn" onClick={() => setIsNavOpen(false)}>&times;</button>
                    <div className={`admin-nav-item ${activeView === 'requests' ? 'active' : ''}`} onClick={() => { setActiveView('requests'); setIsNavOpen(false); }}>Manage Requests</div>
                    <div className={`admin-nav-item ${activeView === 'tournaments' ? 'active' : ''}`} onClick={() => { setActiveView('tournaments'); setIsNavOpen(false); }}>Tournaments</div>
                    <div className={`admin-nav-item ${activeView === 'players' ? 'active' : ''}`} onClick={() => { setActiveView('players'); setIsNavOpen(false); }}>Players</div>
                    <div className={`admin-nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => { setActiveView('settings'); setIsNavOpen(false); }}>App Settings</div>
                </nav>
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;