import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{
      width: 240,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 32
    }}>
      <img
        src={user.profileImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.fullName)}
        alt="Profile"
        style={{ width: 72, height: 72, borderRadius: '50%', marginBottom: 16, objectFit: 'cover', border: '2px solid #eee' }}
      />
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 32 }}>{user.fullName}</div>
      <div style={{ width: '100%' }}>
        <MenuItem label="Dashboard" active={activeMenu === 'Dashboard'} onClick={() => navigate('/dashboard')} icon={<span style={{marginRight:8}}>📊</span>} />
        <MenuItem label="Income" active={activeMenu === 'Income'} onClick={() => navigate('/income')} icon={<span style={{marginRight:8}}>💰</span>} />
        <MenuItem label="Expense" active={activeMenu === 'Expense'} onClick={() => navigate('/expense')} icon={<span style={{marginRight:8}}>🧾</span>} />
        <MenuItem label="Budget Planner" active={activeMenu === 'BudgetPlanner'} onClick={() => navigate('/budget-planner')} icon={<span style={{marginRight:8}}>🎯</span>} />
        <MenuItem label="Logout" onClick={handleLogout} icon={<span style={{marginRight:8}}>↩️</span>} />
      </div>
    </div>
  );
};

const MenuItem = ({ label, active, onClick, icon }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      cursor: 'pointer',
      background: active ? '#875cf5' : 'transparent',
      color: active ? '#fff' : '#222',
      fontWeight: 500,
      borderRadius: 8,
      margin: '4px 12px',
      transition: 'background 0.2s',
    }}
  >
    {icon}
    {label}
  </div>
);

export default SideMenu;

