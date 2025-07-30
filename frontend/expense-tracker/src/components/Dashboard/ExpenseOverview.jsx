import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import AddExpenseModal from './AddExpenseModal';

const ExpenseOverview = ({ expenses, loading, error, refreshExpenses }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Group expenses by date for chart
  const chartData = useMemo(() => {
    const grouped = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      grouped[date] = (grouped[date] || 0) + exp.amount;
    });
    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [expenses]);

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
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <AddExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={refreshExpenses} />
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Expense Overview</div>
          <div style={{ color: '#888', fontSize: 15 }}>Track your spending trends over time and gain insights into where your money goes.</div>
        </div>
        <button style={{
          background: '#f6f0fd',
          color: '#875cf5',
          border: 'none',
          borderRadius: 8,
          padding: '10px 18px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(135,92,245,0.08)',
          transition: 'background 0.2s',
        }}
        onClick={() => setModalOpen(true)}
        >
          + Add Expense
        </button>
      </div>
      <div style={{ width: '100%', minHeight: 220 }}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : chartData.length === 0 ? (
          <div>No expense data.</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#875cf5" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#875cf5" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="amount" stroke="#875cf5" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} dot={{ r: 5, fill: '#875cf5' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview; 