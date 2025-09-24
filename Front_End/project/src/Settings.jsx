import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username !== 'guest' && userEmail) {
      fetchSettings();
    }
  }, [username, userEmail]);

  const fetchSettings = async () => {
    try {
      // Replace with actual backend API endpoint for user settings
      const response = await axios.get(`http://127.0.0.1:8000/user/settings/?email=${userEmail}`);
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="settings-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Settings</h2>
      {username === 'guest' ? (
        <p>Please log in to view your settings.</p>
      ) : !settings ? (
        <p>Loading settings...</p>
      ) : (
        <div className="settings-details">
          {/* Add settings form or display here */}
          <p>Notification Preferences: {settings.notifications ? 'Enabled' : 'Disabled'}</p>
          <p>Language: {settings.language}</p>
          {/* Add more settings fields as needed */}
        </div>
      )}
    </div>
  );
};

export default Settings;
