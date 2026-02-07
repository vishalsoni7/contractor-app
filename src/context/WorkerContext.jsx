import { createContext, useContext, useState, useEffect } from 'react';
import { workersAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WorkerContext = createContext(null);

export const WorkerProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch workers when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkers();
    } else {
      setWorkers([]);
    }
  }, [isAuthenticated]);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workersAPI.getAll();
      setWorkers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching workers:', err);
    }
    setLoading(false);
  };

  const addWorker = async (workerData) => {
    try {
      const newWorker = await workersAPI.create(workerData);
      setWorkers(prev => [...prev, newWorker]);
      return { success: true, worker: newWorker };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateWorker = async (id, updates) => {
    try {
      const updatedWorker = await workersAPI.update(id, updates);
      setWorkers(prev => prev.map(w => w.id === id ? updatedWorker : w));
      return { success: true, worker: updatedWorker };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteWorker = async (id) => {
    try {
      await workersAPI.delete(id);
      setWorkers(prev => prev.filter(w => w.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleWorkerStatus = async (id) => {
    try {
      const updatedWorker = await workersAPI.toggleStatus(id);
      setWorkers(prev => prev.map(w => w.id === id ? updatedWorker : w));
      return { success: true, worker: updatedWorker };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getWorker = (id) => {
    return workers.find(w => w.id === id);
  };

  const getActiveWorkers = () => {
    return workers.filter(w => w.status === 'active');
  };

  return (
    <WorkerContext.Provider value={{
      workers,
      loading,
      error,
      fetchWorkers,
      addWorker,
      updateWorker,
      deleteWorker,
      toggleWorkerStatus,
      getWorker,
      getActiveWorkers,
    }}>
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorkers = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorkers must be used within a WorkerProvider');
  }
  return context;
};
