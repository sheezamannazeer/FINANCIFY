import React, { useState } from 'react';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import { validEmail } from '../../utils/helper';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = React.useContext(UserContext);

  // Helper to upload image
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    setLoading(true);
    let valid = true;
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setError('');
    if (!fullName.trim()) {
      setFullNameError('Full name is required.');
      valid = false;
    }
    if (!validEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      valid = false;
    }
    if (!valid) { setLoading(false); return; }
    // Signup API Call
    try {
      let profileImageUrl = '';
      if (photo && typeof photo !== 'string') {
        // If photo is a File object, upload it
        const imgUploadRes = await uploadImage(photo);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        fullName,
        email,
        password,
        profileImageUrl,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-single-col-bg">
      <div className="login-form-container">
        <h2 className="auth-title" style={{ textAlign: 'center', marginBottom: 24 }}>FINANCIFY</h2>
        <h3 className="login-title">Create an Account</h3>
        <p className="login-subtitle">
          Join us today by entering your details below.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <ProfilePhotoSelector value={photo} onChange={setPhoto} />
          </div>
          <label htmlFor="fullName" className="login-label">Full Name</label>
          <input
            type="text"
            id="fullName"
            className="login-input"
            placeholder="Full Name"
            value={fullName}
            onChange={e => { setFullName(e.target.value); if (fullNameError) setFullNameError(''); }}
            required
          />
          {fullNameError && <div className="login-error">{fullNameError}</div>}
          <label htmlFor="email" className="login-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="john@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
            required
          />
          {emailError && <div className="login-error">{emailError}</div>}
          <label htmlFor="password" className="login-label">Password</label>
          <div className="login-password-wrapper">
            <input
              type="password"
              id="password"
              className="login-input login-password-input"
              placeholder="Min 8 Characters"
              minLength={8}
              value={password}
              onChange={e => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
              required
            />
          </div>
          {passwordError && <div className="login-error">{passwordError}</div>}
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing Up..." : "SIGN UP"}
          </button>
        </form>
        <p className="login-signup-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
