import React, { useState } from 'react';
import axios from 'axios';
import './Loginpage.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        if (!email) {
            setError('Please enter your email address');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/forgot-password/', { email });
            setMessage(response.data.msg);
            setEmail('');
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

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Forgot Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    {error && <div className="message error-message">{error}</div>}
                    {message && <div className="message success-message">{message}</div>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/react/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
