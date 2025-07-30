import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Dashboard/IncomeOverview';
import IncomeSources from '../../components/Dashboard/IncomeSources';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL);
      setIncomes(res.data || []);
    } catch (err) {
      setError('Failed to load income data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  return (
    <DashboardLayout activeMenu="Income">
      <IncomeOverview incomes={incomes} loading={loading} error={error} refreshIncomes={fetchIncomes} />
      <IncomeSources incomes={incomes} loading={loading} error={error} refreshIncomes={fetchIncomes} />
      {/* TODO: Add Income Sources/Transactions list below */}
    </DashboardLayout>
  );
};

export default Income;
