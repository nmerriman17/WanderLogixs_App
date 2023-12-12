import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './loginsignup.css';

const response = await axios.post(endpoint, credentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
const Loginsignup = () => {
    const [action, setAction] = useState('Sign Up');
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (action === 'Sign Up' && !credentials.name) {
            setError('Please enter your name.');
            return false;
        }
        if (!credentials.email) {
            setError('Please enter your email.');
            return false;
        }
        if (!credentials.password) {
            setError('Please enter your password.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const endpoint = action === 'Sign Up' ? '/api/signup' : '/api/login';
        try {
            const response = await axios.post(endpoint, credentials);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data); 
            } else {
                setError('Failed to log in or sign up');
            }
        }
    };

    return (
        <div className='login-signup-container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === 'Sign Up' && (
                    <div className="input">
                        <input type="text" name="name" placeholder="Name" className="form-control" onChange={handleChange} />
                    </div>
                )}
                <div className="input">
                    <input type="email" name="email" placeholder="Email Address" className="form-control" onChange={handleChange} />
                </div>
                <div className="input">
                    <input type="password" name="password" placeholder="Password" className="form-control" onChange={handleChange} />
                </div>
                {action === 'Login' && (
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                )}
            </div>
            <div className="submit-container">
                <button className="btn btn-primary submit" onClick={() => setAction('Sign Up')}>Sign Up</button>
                <button className="btn btn-primary submit" onClick={() => setAction('Login')}>Login</button>
                <button className="btn btn-secondary submit" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Loginsignup;
