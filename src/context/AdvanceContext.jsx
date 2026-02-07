import { createContext, useContext, useState, useEffect } from 'react';
import { advancesAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const AdvanceContext = createContext(null);

export const AdvanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch advances when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdvances();
    } else {
      setAdvances([]);
    }
  }, [isAuthenticated]);

  const fetchAdvances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await advancesAPI.getAll();
      setAdvances(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch advances:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAdvance = async (workerId, amount, reason = '', date = null) => {
    try {
      setError(null);
      const newAdvance = await advancesAPI.create({
        workerId,
        amount: parseFloat(amount),
        reason,
        date: date || new Date().toISOString().split('T')[0],
      });
      setAdvances(prev => [...prev, newAdvance]);
      return newAdvance;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAdvance = async (id) => {
    try {
      setError(null);
      await advancesAPI.delete(id);
      setAdvances(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAdvancesForWorker = (workerId) => {
    return advances.filter(a => a.workerId === workerId || a.workerId?._id === workerId);
  };

  const getAdvancesForMonth = (year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return advances.filter(a => a.date.startsWith(monthStr));
  };

  const getTotalAdvancesForWorker = (workerId) => {
    return advances
      .filter(a => a.workerId === workerId || a.workerId?._id === workerId)
      .reduce((sum, a) => sum + a.amount, 0);
  };

  const getTotalAdvancesForWorkerInMonth = (workerId, year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return advances
      .filter(a => (a.workerId === workerId || a.workerId?._id === workerId) && a.date.startsWith(monthStr))
      .reduce((sum, a) => sum + a.amount, 0);
  };

  return (
    <AdvanceContext.Provider value={{
      advances,
      loading,
      error,
      addAdvance,
      deleteAdvance,
      getAdvancesForWorker,
      getAdvancesForMonth,
      getTotalAdvancesForWorker,
      getTotalAdvancesForWorkerInMonth,
      refreshAdvances: fetchAdvances,
    }}>
      {children}
    </AdvanceContext.Provider>
  );
};

export const useAdvances = () => {
  const context = useContext(AdvanceContext);
  if (!context) {
    throw new Error('useAdvances must be used within an AdvanceProvider');
  }
  return context;
};
