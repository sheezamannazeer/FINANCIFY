import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#875cf5', '#e53935', '#ff9800']; // Balance, Expense, Income

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const data = [
    { name: 'Total Balance', value: totalBalance },
    { name: 'Total Expenses', value: totalExpense },
    { name: 'Total Income', value: totalIncome },
  ];

  // For the donut, we want the total to be the sum of all, but visually, balance is usually income - expense
  // We'll show all three as segments for clarity

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
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 16, alignSelf: 'flex-start' }}>Financial Overview</div>
      <div style={{ width: '100%', height: 300, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={120}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value, entry, index) => {
                const color = COLORS[index % COLORS.length];
                return <span style={{ color, fontWeight: 600, fontSize: 15 }}>{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centered label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 20, color: '#888', fontWeight: 500 }}>Total Balance</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#222' }}>
            ₹{totalBalance?.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
