import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import ExpenseOverview from '../../components/Dashboard/ExpenseOverview'
import AllExpenses from '../../components/Dashboard/AllExpenses'
import axiosInstance from '../../utils/axiosInstance'
import API_PATHS from '../../utils/apiPath'

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      setExpenses(res.data);
    } catch (err) {
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <ExpenseOverview expenses={expenses} loading={loading} error={error} refreshExpenses={fetchExpenses} />
      <AllExpenses expenses={expenses} loading={loading} error={error} refreshExpenses={fetchExpenses} />
    </DashboardLayout>
  )
}

export default Expense
