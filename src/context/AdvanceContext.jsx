import { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/calculations';

const AdvanceContext = createContext(null);

export const AdvanceProvider = ({ children }) => {
  const [advances, setAdvances] = useState([]);

  useEffect(() => {
    const savedAdvances = storage.get(STORAGE_KEYS.ADVANCES);
    if (savedAdvances) setAdvances(savedAdvances);
  }, []);

  const saveAdvances = (newAdvances) => {
    storage.set(STORAGE_KEYS.ADVANCES, newAdvances);
    setAdvances(newAdvances);
  };

  const addAdvance = (workerId, amount, reason = '', date = null) => {
    const newAdvance = {
      id: generateId(),
      workerId,
      amount: parseFloat(amount),
      reason,
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    const updatedAdvances = [...advances, newAdvance];
    saveAdvances(updatedAdvances);
    return newAdvance;
  };

  const deleteAdvance = (id) => {
    const updatedAdvances = advances.filter(a => a.id !== id);
    saveAdvances(updatedAdvances);
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
      addAdvance,
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
