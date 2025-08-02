import React, { useState } from 'react';
import { validEmail } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiTrendingUp, 
  FiShield, 
  FiBarChart3,
  FiZap
} from 'react-icons/fi';

const LoginModern = () => {
  console.log('LoginModern component is loading...');
  
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
    console.log('Login form submitted');
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
    
    setIsLoading(true);
    console.log('Making API call to:', API_PATHS.AUTH.LOGIN);
    console.log('With data:', { email, password });
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log('API response:', response.data);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300/20 rounded-full float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-300/20 rounded-full float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-yellow-300/20 rounded-full float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 card-glass">
            <FiTrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-3">FINANCIFY</h1>
          <p className="text-white/80 text-lg">Your Smart Money Manager</p>
        </div>

        {/* Login Form Card */}
        <div className="card-glass rounded-3xl p-8 shadow-2xl slide-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/70">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label text-white/90">
                Email Address
              </label>
              <div className="input-with-icon">
                <FiMail className="input-icon text-white/50" />
                <input
                  type="email"
                  id="email"
                  className="form-input bg-white/10 border-white/20 text-white placeholder-white/50"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              {emailError && (
                <p className="form-error text-red-300 fade-in">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label text-white/90">
                Password
              </label>
              <div className="input-with-icon">
                <FiLock className="input-icon text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input bg-white/10 border-white/20 text-white placeholder-white/50 pr-12"
                  placeholder="Enter your password"
                  minLength={8}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-white/50 hover:text-white/70 transition-colors" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="form-error text-red-300 fade-in">{passwordError}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="status-error rounded-lg p-4 fade-in">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <a
                href="/signUp"
                className="text-white font-semibold hover:text-purple-200 transition-colors duration-200"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 card-glass">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-xs">Smart Tracking</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 card-glass">
              <FiBarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-xs">AI Insights</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 card-glass">
              <FiShield className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-xs">Secure</p>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-1/4 right-10 opacity-20">
        <FiZap className="w-8 h-8 text-white float" />
      </div>
      <div className="absolute bottom-1/4 left-10 opacity-20">
        <FiTrendingUp className="w-6 h-6 text-white float" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  );
};

export default LoginModern; 