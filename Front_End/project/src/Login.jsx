import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpage.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!email || !password) {
            setError("Fill the details");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://127.0.0.1:8000/login/", {
                email,
                password
            });

            if (res.status === 200) {
                // setSuccess("Login Successful");
                alert("Login Successful");
                localStorage.setItem('Login', 'yes')
                localStorage.setItem('name',res.data.name);
                localStorage.setItem('email',email);
                setEmail("");
                setPassword("");
                // Call the onLoginSuccess callback
                onLoginSuccess();
                // Redirect after successful login
                setTimeout(() => {
                    navigate('/react');
                }, 1500);
            }
        } catch (err) {
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        setError("Fill the details");
                        break;
                    case 401:
                        setError("Invalid Password");
                        break;
                    case 404:
                        setError("User Does Not Exist");
                        break;
                    case 405:
                        setError("Invalid Method");
                        break;
                    case 500:
                        setError(err.response.data.err || "Server error occurred");
                        break;
                    default:
                        setError("An unexpected error occurred");
                }
            } else if (err.request) {
                setError("No response from server. Please check your connection.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <p>Welcome back! <br/> Please enter your credentials.</p>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            disabled={loading}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <div className="message error-message">{error}</div>}
                    {success && <div className="message success-message">{success}</div>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="login-footer">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <span> | </span>
                    <Link to="/register">Don't have an account?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
