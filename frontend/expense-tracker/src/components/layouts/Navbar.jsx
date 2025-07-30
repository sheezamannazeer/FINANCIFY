import React from 'react';
import { HiOutlineMenu } from 'react-icons/hi';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <div style={{
      width: '100%',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Hamburger menu on the left */}
      <button
        className="navbar-menu-btn"
        style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#875cf5', display: 'flex', alignItems: 'center', marginRight: 16 }}
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <HiOutlineMenu />
      </button>
      {/* Site Name */}
      <div style={{ fontWeight: 800, fontSize: 24, color: '#875cf5', letterSpacing: 1, fontFamily: 'Poppins, sans-serif' }}>
        Financify
      </div>
    </div>
  );
};

export default Navbar;
