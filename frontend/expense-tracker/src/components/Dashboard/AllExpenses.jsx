import React from 'react';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';

const boxStyle = {
  background: '#fff',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 2px 16px rgba(135,92,245,0.10)',
  marginBottom: 32,
};
const iconStyle = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: '#f6f3fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  marginRight: 18,
};
const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#ff4d4f',
  fontSize: 22,
  cursor: 'pointer',
  marginLeft: 16,
};
const downloadBtnStyle = {
  background: '#f6f3fa',
  color: '#222',
  border: 'none',
  borderRadius: 8,
  padding: '8px 18px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const AllExpenses = ({ expenses, loading, error, refreshExpenses }) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      refreshExpenses();
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  const handleDownload = () => {
    if (!expenses.length) return;
    const header = 'Category,Amount,Date\n';
    const rows = expenses.map(e => {
      const d = new Date(e.date);
      const dateStr = d.toISOString().slice(0, 10);
      return `"${e.category}",${e.amount},${dateStr}`;
    }).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={boxStyle}>
      {/* Responsive grid styles */}
      <style>{`
        .all-expenses-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 900px) {
          .all-expenses-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .expense-item {
          display: flex;
          align-items: center;
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>All Expenses</div>
        <button style={downloadBtnStyle} onClick={handleDownload}>
          <span style={{ fontSize: 20 }}>⭳</span> Download
        </button>
      </div>
      {loading ? (
        <div>Loading expenses...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : expenses.length === 0 ? (
        <div>No expenses found.</div>
      ) : (
        <div className="all-expenses-grid">
          {expenses.map(expense => (
            <div key={expense._id} className="expense-item">
              <div style={iconStyle}>{expense.icon || '🧾'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18, color: '#222' }}>{expense.category}</div>
                <div style={{ color: '#888', fontSize: 15, marginTop: 2 }}>
                  {new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: '#ff4d4f', fontSize: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
                - ₹{expense.amount.toLocaleString()}
                <span style={{ fontSize: 18 }}>📉</span>
              </div>
              <button style={deleteBtnStyle} title="Delete" onClick={() => handleDelete(expense._id)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllExpenses; 