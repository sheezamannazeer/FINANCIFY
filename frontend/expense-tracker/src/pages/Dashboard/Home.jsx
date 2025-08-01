import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpensesChart from '../../components/Dashboard/Last30DaysExpensesChart';
import IncomeTransactions from '../../components/Dashboard/IncomeTransactions';
import Last30DaysIncomeChart from '../../components/Dashboard/Last30DaysIncomeChart';


const cardColors = [
  { bg: '#f6f3fa', border: '#875cf5', color: '#875cf5' }, // Balance
  { bg: '#e6f7f1', border: '#34c759', color: '#34c759' }, // Income
  { bg: '#fff4f4', border: '#e53935', color: '#e53935' }, // Expense
];

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching dashboard data...');
        console.log('Token in localStorage:', localStorage.getItem('token'));
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        console.log('Dashboard response:', res.data);
        setDashboard(res.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div style={{ marginTop: 32, marginLeft: 16, marginRight: 16 }}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : dashboard ? (
          <>
            <div
              style={{
                display: 'flex',
                gap: 32,
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <DashboardCard
                title="Total Balance"
                value={dashboard.totalBalance}
                color={cardColors[0]}
                icon={<span role="img" aria-label="balance">₹</span>}
              />
              <DashboardCard
                title="Total Income"
                value={dashboard.totalIncome}
                color={cardColors[1]}
                icon={<span role="img" aria-label="income">⬆️</span>}
              />
              <DashboardCard
                title="Total Expense"
                value={dashboard.totalExpense}
                color={cardColors[2]}
                icon={<span role="img" aria-label="expense">⬇️</span>}
              />
            </div>

            {/* Main dashboard row (Recent Transactions + Financial Overview) */}
            <div
              className="dashboard-flex-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 32,
                marginTop: 32,
                alignItems: 'stretch',
                flexWrap: 'nowrap',
                width: '100%',
                minHeight: 400,
              }}
            >
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <RecentTransactions />
              </div>
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <FinanceOverview
                  totalBalance={dashboard.totalBalance}
                  totalIncome={dashboard.totalIncome}
                  totalExpense={dashboard.totalExpense}
                />
              </div>
            </div>
            {/* Expenses row (ExpenseTransactions + Last30DaysExpensesChart) */}
            <div
              className="dashboard-flex-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 32,
                marginTop: 32,
                alignItems: 'stretch',
                flexWrap: 'nowrap',
                width: '100%',
                minHeight: 400,
              }}
            >
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <ExpenseTransactions />
              </div>
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <Last30DaysExpensesChart />
              </div>
            </div>
            {/* Income row (IncomeTransactions + Last30DaysIncomeChart) */}
            <div
              className="dashboard-flex-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 32,
                marginTop: 32,
                alignItems: 'stretch',
                flexWrap: 'nowrap',
                width: '100%',
                minHeight: 400,
              }}
            >
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <IncomeTransactions />
              </div>
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <Last30DaysIncomeChart />
              </div>
            </div>

            {/* Quick Access Cards */}
            <div
              className="dashboard-flex-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 32,
                marginTop: 32,
                alignItems: 'stretch',
                flexWrap: 'nowrap',
                width: '100%',
                minHeight: 200,
              }}
            >
              <QuickAccessCard
                title="🎯 Budget Planner"
                description="Create intelligent budget plans based on your spending patterns"
                onClick={() => window.location.href = '/budget-planner'}
                color={{ bg: '#f0f8ff', border: '#2196f3', color: '#2196f3' }}
              />
            </div>
            <style>{`
              @media (max-width: 900px) {
                .dashboard-flex-row {
                  flex-direction: column !important;
                  gap: 24px !important;
                  min-height: unset !important;
                  flex-wrap: wrap !important;
                }
              }
            `}</style>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

const DashboardCard = ({ title, value, color, icon }) => (
  <div
    className="dashboard-card"
    style={{
      background: color.bg,
      border: `2.5px solid ${color.border}`,
      color: color.color,
      borderRadius: 18,
      minWidth: 320,
      flex: 1,
      maxWidth: 480,
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      boxShadow: '0 2px 16px rgba(135,92,245,0.10)',
      marginBottom: 8,
    }}
  >
    <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 800 }}>
      ₹ {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
  </div>
);

const QuickAccessCard = ({ title, description, onClick, color }) => (
  <div
    className="quick-access-card"
    style={{
      background: color.bg,
      border: `2.5px solid ${color.border}`,
      color: color.color,
      borderRadius: 18,
      minWidth: 320,
      flex: 1,
      maxWidth: 480,
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      boxShadow: '0 2px 16px rgba(135,92,245,0.10)',
      marginBottom: 8,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-4px)';
      e.target.style.boxShadow = '0 4px 20px rgba(135,92,245,0.20)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 2px 16px rgba(135,92,245,0.10)';
    }}
  >
    <div style={{ fontSize: 32, marginBottom: 16 }}>{title.split(' ')[0]}</div>
    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>{title}</div>
    <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>
      {description}
    </div>
    <div style={{ 
      marginTop: 16, 
      fontSize: 14, 
      fontWeight: 600,
      opacity: 0.8 
    }}>
      Click to access →
    </div>
  </div>
);

export default Home;
