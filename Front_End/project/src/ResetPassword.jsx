import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Loginpage.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/reset-password/', {
                token,
                new_password: newPassword
            });
            
            setMessage(response.data.msg);
            setNewPassword('');
            setConfirmPassword('');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/react/login');
            }, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.err || 'An error occurred');
            } else if (err.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h2>Invalid Reset Link</h2>
                    <p>This password reset link is invalid or has expired.</p>
                    <div className="login-footer">
                        <a href="/react/forgot-password">Request a new reset link</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Reset Password</h2>
                <p>Please enter your new password.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                            required
                            placeholder="Enter new password"
                            minLength="6"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            required
                            placeholder="Confirm new password"
                            minLength="6"
                        />
                    </div>

                    {error && <div className="message error-message">{error}</div>}
                    {message && <div className="message success-message">{message}</div>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/react/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
