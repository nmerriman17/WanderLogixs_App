import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './loginsignup.css';

const Loginsignup = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? '/api/signup' : '/api/login';
        try {
            const response = await axios.post(endpoint, credentials, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            // Storing the token in session storage
            if (response.data.token) {
                sessionStorage.setItem('token', response.data.token);
                navigate('/itinerary');
            } else {
                throw new Error('Token not received');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className='login-signup-container'>
            <div className="header">
                <div className="text">{isSignup ? 'Sign Up' : 'Login'}</div>
                <div className="underline"></div>
            </div>
            <form onSubmit={handleSubmit} className="inputs">
                {isSignup && (
                    <div className="input">
                        <input type="text" name="name" placeholder="Name" value={credentials.name} onChange={handleChange} />
                    </div>
                )}
                <div className="input">
                    <input type="email" name="email" placeholder="Email Address" value={credentials.email} onChange={handleChange} />
                </div>
                <div className="input">
                    <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} />
                </div>
                <div className="button-container">
                    <button className="btn btn-primary submit" type="submit">Submit</button>
                    <button className="btn btn-switch" type="button" onClick={() => setIsSignup(!isSignup)}>
                        Switch to {isSignup ? 'Login' : 'Sign Up'}
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default Loginsignup;
