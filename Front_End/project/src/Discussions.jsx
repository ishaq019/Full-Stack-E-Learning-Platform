import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discussions.css';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username !== 'guest' && userEmail) {
      fetchDiscussions();
    }
  }, [username, userEmail]);

  const fetchDiscussions = async () => {
    try {
      // Replace with actual backend API endpoint for discussions
      const response = await axios.get(`http://127.0.0.1:8000/user/discussions/?email=${userEmail}`);
      if (response.data && response.data.discussions) {
        setDiscussions(response.data.discussions);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  return (
    <div className="discussions-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Discussions</h2>
      {username === 'guest' ? (
        <p>Please log in to view discussions.</p>
      ) : discussions.length === 0 ? (
        <p>No discussions found.</p>
      ) : (
        <ul className="discussions-list">
          {discussions.map(discussion => (
            <li key={discussion.id} className="discussion-item">
              <h3>{discussion.title}</h3>
              <p>{discussion.content}</p>
              <p>Posted by: {discussion.author}</p>
              <p>Date: {discussion.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Discussions;
