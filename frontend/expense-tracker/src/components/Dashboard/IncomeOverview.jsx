import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AddIncomeButton from './AddIncomeButton';
import AddIncomeModal from './AddIncomeModal';

const IncomeOverview = ({ incomes, loading, error, refreshIncomes }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Prepare chart data from incomes prop
  const data = (incomes || []).map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    amount: item.amount,
  }));

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 16px rgba(135,92,245,0.10)', marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>Income Overview</div>
          <div style={{ color: '#888', fontSize: 15, marginTop: 4 }}>Track your earnings over time and analyze your income trends.</div>
        </div>
        <AddIncomeButton onClick={() => setShowAddModal(true)} />
      </div>
      <AddIncomeModal open={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={refreshIncomes} />
      {loading ? (
        <div>Loading income chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barCategoryGap={18}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={{ fontWeight: 600, fontSize: 14 }} />
            <YAxis style={{ fontWeight: 600, fontSize: 14 }} />
            <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#875cf5" />
          </BarChart>
        </ResponsiveContainer>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default IncomeOverview; 