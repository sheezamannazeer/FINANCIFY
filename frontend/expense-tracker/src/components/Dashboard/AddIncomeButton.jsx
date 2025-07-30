import React from 'react';

const AddIncomeButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: '#f6f3fa',
      color: '#875cf5',
      border: 'none',
      borderRadius: 8,
      padding: '10px 22px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 16,
      boxShadow: '0 2px 8px rgba(135,92,245,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    + Add Income
  </button>
);

export default AddIncomeButton; 