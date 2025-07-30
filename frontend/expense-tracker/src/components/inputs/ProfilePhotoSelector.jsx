import React, { useRef, useState } from 'react';
import './ProfilePhotoSelector.css';

const ProfilePhotoSelector = ({ value, onChange }) => {
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(value || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (onChange) onChange(file);
    }
  };

  return (
    <div className="photo-selector" onClick={() => fileInputRef.current.click()}>
      <div className="photo-avatar">
        {preview ? (
          <img src={preview} alt="Profile" className="photo-img" />
        ) : (
          <span className="photo-placeholder">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#ede6fa" />
              <path d="M12 13.5c1.38 0 2.5-1.12 2.5-2.5S13.38 8.5 12 8.5 9.5 9.62 9.5 11s1.12 2.5 2.5 2.5Zm0 1.5c-2.33 0-7 1.17-7 3.5V20h14v-1.5c0-2.33-4.67-3.5-7-3.5Z" fill="#a084fa" />
            </svg>
          </span>
        )}
        <span className="photo-upload-icon">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#a084fa" />
            <path d="M12 8v8m0 0-3-3m3 3 3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePhotoSelector;
