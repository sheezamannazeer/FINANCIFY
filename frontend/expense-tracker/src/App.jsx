import React from 'react'
import './index.css'

import{
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Login from './pages/Auth/LoginSimple'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import BudgetPlanner from './pages/Dashboard/BudgetPlanner'
import UserProvider from './context/userContext'

// Debug component to catch errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong!</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  console.log('App component is loading...');
  
  return (
    <ErrorBoundary>
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signUp" exact element={<SignUp />} />
              <Route path="/dashboard" exact element={<Home />} />
              <Route path="/income" exact element={<Income />} />
              <Route path="/expense" exact element={<Expense />} />
              <Route path="/budget-planner" exact element={<BudgetPlanner />} />
            </Routes>
          </Router>
        </div>
      </UserProvider>
    </ErrorBoundary>
  )
}

export default App

const Root = () => {
  console.log('Root component is loading...');
  const isAuthenticated = !!localStorage.getItem('token');
  console.log('Is authenticated:', isAuthenticated);

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};