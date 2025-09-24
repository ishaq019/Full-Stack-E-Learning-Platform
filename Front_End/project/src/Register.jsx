import React, { useState } from 'react';
import axios from 'axios';
import './Registerpage.css';

// Registration endpoint
const REGISTRATION_URL = 'http://127.0.0.1:8000/register/';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const store = async (e) => {
    e.preventDefault();

    // Reset error state
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Register the user
      const registrationResponse = await axios.post(REGISTRATION_URL, {
        username,
        email,
        password
      });

      // Check the actual response status
      if (registrationResponse.status === 200) {
        alert(`Registration Successful! Welcome to our E-learning platform.`);
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      if (err.response) {
        // Handle specific error cases
        switch (err.response.status) {
          case 400:
            setError(err.response.data.err || 'Email already exists or invalid data.');
            break;
          case 500:
            setError(err.response.data.err || 'Server error occurred');
            break;
          default:
            setError('Something went wrong. Please try again.');
        }
      } else if (err.request) {
        setError('No response from server for registration. Please check your connection.');
      } else {
        setError('Error setting up registration request. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <form onSubmit={store} className="register-form">
          <h3 className="register-title">Register</h3>
          
          {error && (
            <div style={{ 
              color: '#e74c3c', 
              backgroundColor: '#fdeaea', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text"
              id="username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
