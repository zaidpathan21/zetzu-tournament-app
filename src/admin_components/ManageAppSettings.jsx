// src/admin_components/ManageAppSettings.jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, update, push, remove } from 'firebase/database';
import { db } from '../config.js';

const ManageAppSettings = () => {
    const [settings, setSettings] = useState({ announcement: '', banners: {} });
    const [loading, setLoading] = useState(true);
    const [newBannerUrl, setNewBannerUrl] = useState('');

    useEffect(() => {
        const settingsRef = ref(db, 'appSettings');
        onValue(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                setSettings(snapshot.val());
            }
            setLoading(false);
        });
    }, []);

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setSettings(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveSettings = async () => {
        try {
            await update(ref(db, 'appSettings'), {
                announcement: settings.announcement
            });
            alert('Settings updated successfully!');
        } catch (error) {
            alert('Failed to update settings.');
        }
    };

    const handleAddBanner = async () => {
        if (!newBannerUrl.trim()) {
            alert('Please enter a banner image URL.');
            return;
        }
        try {
            const bannersRef = ref(db, 'appSettings/banners');
            await push(bannersRef, newBannerUrl);
            alert('Banner added successfully!');
            setNewBannerUrl(''); // Clear the input field
        } catch (error) {
            alert('Failed to add banner.');
        }
    };

    const handleDeleteBanner = async (bannerId) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await remove(ref(db, `appSettings/banners/${bannerId}`));
                alert('Banner deleted successfully.');
            } catch (error) {
                alert('Failed to delete banner.');
            }
        }
    };

    if (loading) {
        return <p>Loading app settings...</p>;
    }

    return (
        <div className="manage-app-settings">
            <h2>App Settings</h2>

            <div className="settings-section">
                <h3>Announcement Text</h3>
                <textarea
                    name="announcement"
                    value={settings.announcement || ''}
                    onChange={handleTextChange}
                    rows="3"
                    placeholder="Enter scrolling announcement text for the home page..."
                />
                <button className="btn-save-settings" onClick={handleSaveSettings}>Save Announcement</button>
            </div>

            <div className="settings-section">
                <h3>Manage Banners</h3>
                <div className="add-banner-form">
                    <input
                        type="text"
                        value={newBannerUrl}
                        onChange={(e) => setNewBannerUrl(e.target.value)}
                        placeholder="Enter new banner image URL..."
                    />
                    <button onClick={handleAddBanner}>+ Add Banner</button>
                </div>

                <h4>Current Banners</h4>
                <div className="banner-list">
                    {settings.banners ? Object.entries(settings.banners).map(([id, url]) => (
                        <div key={id} className="banner-item">
                            <img src={url} alt="Banner Preview" />
                            <button className="btn-delete-banner" onClick={() => handleDeleteBanner(id)}>Delete</button>
                        </div>
                    )) : <p>No banners found.</p>}
                </div>
            </div>
        </div>
    );
};

export default ManageAppSettings;