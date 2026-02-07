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

  const fetchAdvances = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await advancesAPI.getAll(params);
      setAdvances(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching advances:', err);
    }
    setLoading(false);
  };

  const addAdvance = async (workerId, amount, reason = '', date = null) => {
    try {
      const advanceData = {
        workerId,
        amount: parseFloat(amount),
        reason,
        date: date || new Date().toISOString().split('T')[0],
      };

      const newAdvance = await advancesAPI.create(advanceData);
      setAdvances(prev => [...prev, newAdvance]);
      return { success: true, advance: newAdvance };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateAdvance = async (id, updates) => {
    try {
      const updatedAdvance = await advancesAPI.update(id, updates);
      setAdvances(prev => prev.map(a => a.id === id ? updatedAdvance : a));
      return { success: true, advance: updatedAdvance };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteAdvance = async (id) => {
    try {
      await advancesAPI.delete(id);
      setAdvances(prev => prev.filter(a => a.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getAdvancesForWorker = (workerId) => {
    return advances.filter(a => a.workerId === workerId);
  };

  const getAdvancesForMonth = (year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return advances.filter(a => a.date.startsWith(monthStr));
  };

  const getTotalAdvancesForWorker = (workerId) => {
    return advances
      .filter(a => a.workerId === workerId)
      .reduce((sum, a) => sum + a.amount, 0);
  };

  const getTotalAdvancesForWorkerInMonth = (workerId, year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return advances
      .filter(a => a.workerId === workerId && a.date.startsWith(monthStr))
      .reduce((sum, a) => sum + a.amount, 0);
  };

  return (
    <AdvanceContext.Provider value={{
      advances,
      loading,
      error,
      fetchAdvances,
      addAdvance,
      updateAdvance,
      deleteAdvance,
      getAdvancesForWorker,
      getAdvancesForMonth,
      getTotalAdvancesForWorker,
      getTotalAdvancesForWorkerInMonth,
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
