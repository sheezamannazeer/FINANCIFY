import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Last30DaysExpensesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        const transactions = res.data.last30DaysExpenses?.transactions || [];
        // Group by date (YYYY-MM-DD) and sum amounts
        const grouped = {};
        transactions.forEach(txn => {
          const date = new Date(txn.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
          grouped[date] = (grouped[date] || 0) + txn.amount;
        });
        // Convert to array and sort by date (last 7 days)
        const chartData = Object.entries(grouped)
          .map(([date, amount]) => ({ date, amount }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        // Show only last 7 days
        setData(chartData.slice(-7));
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
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 24, alignSelf: 'flex-start' }}>Last 30 Days Expenses</div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : data.length === 0 ? (
        <div>No expense data.</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} style={{ fontFamily: 'inherit' }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
            <Bar dataKey="amount" fill="#875cf5" radius={[8, 8, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Last30DaysExpensesChart; 