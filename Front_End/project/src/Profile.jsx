import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username !== 'guest' && userEmail) {
      fetchUserInfo();
    }
  }, [username, userEmail]);

  const fetchUserInfo = async () => {
    try {
      // Replace with actual backend API endpoint for user profile
      const response = await axios.get(`http://127.0.0.1:8000/user/profile/?email=${userEmail}`);
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <div className="profile-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>User Profile</h2>
      {username === 'guest' ? (
        <p>Please log in to view your profile.</p>
      ) : !userInfo ? (
        <p>Loading profile...</p>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Joined:</strong> {new Date(userInfo.joined_date).toLocaleDateString()}</p>
          {/* Add more profile fields as needed */}
        </div>
      )}
    </div>
  );
};

export default Profile;
