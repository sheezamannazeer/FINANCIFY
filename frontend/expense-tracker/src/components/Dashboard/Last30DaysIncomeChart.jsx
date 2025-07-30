import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';

const COLORS = ['#875cf5', '#34c759', '#f6c23e', '#e53935', '#00bcd4', '#ff9800'];

const Last30DaysIncomeChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/v1/dashboard');
        // Extract last 30 days income transactions
        const transactions = res.data.last30DaysExpenseTransactions?.transactions || [];
        // Group by source
        const grouped = {};
        let sum = 0;
        transactions.forEach(item => {
          grouped[item.source] = (grouped[item.source] || 0) + item.amount;
          sum += item.amount;
        });
        setTotal(sum);
        setData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
      } catch (err) {
        setError('Failed to load income data.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, []);

  if (loading) return <div>Loading income chart...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data.length) return <div>No income data for last 30 days.</div>;

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 16px rgba(135,92,245,0.10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, width: '100%' }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>Last 30 Days Income</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 12, fontWeight: 700, fontSize: 18 }}>
        Total Income <span style={{ color: '#875cf5' }}>₹{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default Last30DaysIncomeChart; 