import React, { useState } from 'react';
import './Login.css';
import { validEmail } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUser } = React.useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setError('');
    if (!validEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      valid = false;
    }
    if (!valid) return;
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  return (
    <div className="auth-single-col-bg">
      <div className="login-form-container">
        <h2 className="auth-title" style={{ textAlign: 'center', marginBottom: 24 }}>FINANCIFY</h2>
        <h3 className="login-title">Welcome Back</h3>
        <p className="login-subtitle">
          Please enter your details to login to your account.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email" className="login-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="john@example.com"
            required
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <div className="login-error">{emailError}</div>}

          <label htmlFor="password" className="login-label">Password</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="login-input login-password-input"
              placeholder="Min 8 Characters"
              minLength={8}
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L18 18" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 4C5 4 2 10 2 10C2 10 4.5 15 10 15C12.1 15 13.9 14.2 15.2 13.1M17.5 10.5C17.5 10.5 15 4 10 4" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="3" stroke="#888" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="10" cy="10" rx="8" ry="6" stroke="#888" strokeWidth="2"/>
                  <circle cx="10" cy="10" r="3" stroke="#888" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>
          {passwordError && <div className="login-error">{passwordError}</div>}
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
        <p className="login-signup-link">
          Don't have an account? <a href="/signup">SignUp</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
