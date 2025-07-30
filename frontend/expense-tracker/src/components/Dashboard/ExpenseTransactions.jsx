import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import { useNavigate } from 'react-router-dom';

const ExpenseTransactions = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        setExpenses(res.data.last30DaysExpenses?.transactions || []);
      } catch (err) {
        setError('Failed to load expenses.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 16px rgba(135,92,245,0.10)',
      padding: '32px 32px 24px 32px',
      minWidth: 320,
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, width: '100%' }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>Expenses</div>
        <button
          onClick={() => navigate('/expense')}
          style={{
            background: '#f6f3fa',
            color: '#875cf5',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          See All <span style={{ fontSize: 18 }}>→</span>
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : expenses.length === 0 ? (
        <div>No expenses found.</div>
      ) : (
        <div style={{ width: '100%' }}>
          {expenses.slice(0, 5).map((txn, idx) => (
            <div key={txn._id || idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 0',
              borderBottom: idx !== expenses.slice(0, 5).length - 1 ? '1px solid #f0f0f0' : 'none',
              background: 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#f6f3fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  color: '#222',
                }}>
                  {txn.icon
                    ? <span style={{ fontSize: 28 }}>{txn.icon}</span>
                    : <span>⬇️</span>
                  }
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{txn.category || 'Expense'}</div>
                  <div style={{ fontSize: 13, color: '#bbb', marginTop: 2 }}>{new Date(txn.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: 17,
                color: '#e53935',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                minWidth: 90,
                justifyContent: 'flex-end',
              }}>
                -₹{txn.amount?.toLocaleString()}
                <span style={{ fontSize: 18 }}>📉</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseTransactions;
