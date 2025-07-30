import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};
const boxStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: 32,
  minWidth: 350,
  boxShadow: '0 2px 16px rgba(135,92,245,0.10)',
  position: 'relative',
};
const closeBtnStyle = {
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'none',
  border: 'none',
  fontSize: 22,
  cursor: 'pointer',
};

const AddExpenseModal = ({ open, onClose, onSuccess }) => {
  const [icon, setIcon] = useState('🧾');
  const [showEmoji, setShowEmoji] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleEmojiSelect = (emojiData) => {
    setIcon(emojiData.emoji);
    setShowEmoji(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        icon,
        category,
        amount: Number(amount),
        date,
      });
      setCategory('');
      setAmount('');
      setDate('');
      setIcon('🧾');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: 18 }}>Add Expense</h2>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Icon</div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              background: '#f6f3fa',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 22,
            }}
            onClick={() => setShowEmoji((v) => !v)}
          >
            <span>{icon}</span>
            <span style={{ fontSize: 15, color: '#875cf5' }}>Pick Icon</span>
          </span>
          {showEmoji && (
            <div style={{ position: 'absolute', zIndex: 10 }}>
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Category</div>
          <input
            type="text"
            placeholder="e.g. Music Subscription, Groceries, etc"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ width: '100%', marginBottom: 14, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
            required
          />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Amount</div>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: '100%', marginBottom: 14, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
            required
            min="0"
          />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Date</div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ width: '100%', marginBottom: 18, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}
            required
          />
          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#875cf5',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 22px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 16,
              width: '100%',
            }}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal; 