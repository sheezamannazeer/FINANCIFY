import React from 'react';
import AIBudgetPlanner from '../../components/Dashboard/AIBudgetPlanner';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const BudgetPlanner = () => {
  return (
    <DashboardLayout activeMenu="BudgetPlanner">
      <div style={{
        padding: 32,
        background: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          <div style={{
            marginBottom: 32,
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#222',
              marginBottom: 8
            }}>
              🎯 Budget Planner
            </h1>
            <p style={{
              fontSize: 16,
              color: '#666',
              maxWidth: 600,
              margin: '0 auto'
            }}>
              Create intelligent budget plans based on your income, expenses, and financial goals
            </p>
          </div>
          
          <AIBudgetPlanner />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BudgetPlanner; 