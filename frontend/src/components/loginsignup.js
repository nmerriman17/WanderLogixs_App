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
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard'); // Adjust the navigation route as needed
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className='login-signup-container'>
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={credentials.name}
                        onChange={handleChange}
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                />
                <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
            </form>
            {error && <p className="error">{error}</p>}
            <button onClick={() => setIsSignup(!isSignup)}>
                Switch to {isSignup ? 'Login' : 'Sign Up'}
            </button>
        </div>
    );
};

export default Loginsignup;
