import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './forgotpassword.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Your API endpoint for sending the reset password email
        const apiEndpoint = '/api/forgot-password';

        try {
            const response = await axios.post(apiEndpoint, { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending reset password email. Please try again.');
        }
    };

    return (
        <div className='forgot-password-container'>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    required 
                />
                <div className="forgot-button-container">
                    <button type="submit" className="btn forgot-btn-primary">Send Reset Link</button>
                    <button onClick={() => navigate('/login')} className="btn forgot-btn-secondary">Back to Login</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
