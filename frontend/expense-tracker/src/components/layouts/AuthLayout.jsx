import React from 'react'
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout-container">
      <div className="auth-layout-left">
        <h2 className="auth-title">FINANCIFY</h2>
        {children}
      </div>
      <div className="auth-layout-right">
        <div className="dashboard-preview">
          <div className="dashboard-balance-card">
            <div className="dashboard-balance-icon">↗️</div>
            <div>
              <div className="dashboard-balance-label">Track Your Income & Expenses</div>
              <div className="dashboard-balance-amount">$430,000</div>
            </div>
          </div>
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <span>All Transactions</span>
              <button className="dashboard-view-more">View More</button>
            </div>
            <div className="dashboard-chart-bars">
              <div className="dashboard-bar" style={{height: '30%'}}></div>
              <div className="dashboard-bar" style={{height: '50%'}}></div>
              <div className="dashboard-bar" style={{height: '70%'}}></div>
              <div className="dashboard-bar" style={{height: '60%'}}></div>
              <div className="dashboard-bar" style={{height: '80%'}}></div>
              <div className="dashboard-bar" style={{height: '55%'}}></div>
              <div className="dashboard-bar" style={{height: '90%'}}></div>
            </div>
            <div className="dashboard-chart-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
