import React, { useState } from 'react';
import { validEmail } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const LoginSimple = () => {
  console.log('LoginSimple component is loading...');
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = React.useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== LOGIN DEBUG START ===');
    console.log('Login form submitted');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setError('');
    
    if (!validEmail(email)) {
      console.log('Email validation failed');
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (password.length < 8) {
      console.log('Password validation failed');
      setPasswordError('Password must be at least 8 characters long.');
      valid = false;
    }
    if (!valid) {
      console.log('Form validation failed, returning');
      return;
    }
    
    console.log('Form validation passed, making API call');
    setIsLoading(true);
    console.log('Making API call to:', API_PATHS.AUTH.LOGIN);
    console.log('With data:', { email, password });
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log('API response received:', response.data);
      const { token, user } = response.data;
      if (token) {
        console.log('Token received, storing and navigating');
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      } else {
        console.log('No token in response');
        setError('No authentication token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. The server is taking too long to respond. Please try again.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        setError('Server error. Please try again in a few moments.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
      console.log('=== LOGIN DEBUG END ===');
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(31, 41, 55, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            FINANCIFY
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Your Smart Money Manager
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Test Button - Remove this later */}
          <button
            type="button"
            onClick={() => {
              setEmail('test@example.com');
              setPassword('test123456');
            }}
            style={{
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Fill Test Credentials
          </button>
          <div>
            <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                background: 'rgba(55, 65, 81, 0.8)',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Enter your email"
              required
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '5px' }}>{emailError}</p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
                              <input
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px',
                    background: 'rgba(55, 65, 81, 0.8)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Enter your password"
                  minLength={8}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {passwordError && (
              <p style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '5px' }}>{passwordError}</p>
            )}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fca5a5'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
            </div>
          )}

                      <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Don't have an account?{' '}
            <a
              href="/signUp"
              style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple; 