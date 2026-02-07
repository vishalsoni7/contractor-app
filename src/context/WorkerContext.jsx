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
    try {
      setLoading(true);
      setError(null);
      const data = await workersAPI.getAll();
      setWorkers(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addWorker = async (workerData) => {
    try {
      setError(null);
      const newWorker = await workersAPI.create(workerData);
      setWorkers(prev => [...prev, newWorker]);
      return newWorker;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateWorker = async (id, updates) => {
    try {
      setError(null);
      const updatedWorker = await workersAPI.update(id, updates);
      setWorkers(prev => prev.map(w => w._id === id ? updatedWorker : w));
      return updatedWorker;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteWorker = async (id) => {
    try {
      setError(null);
      await workersAPI.delete(id);
      setWorkers(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getWorker = (id) => {
    return workers.find(w => w._id === id || w.id === id);
  };

  const getActiveWorkers = () => {
    return workers.filter(w => w.status === 'active');
  };

  const toggleWorkerStatus = async (id) => {
    try {
      setError(null);
      const updatedWorker = await workersAPI.toggleStatus(id);
      setWorkers(prev => prev.map(w => w._id === id ? updatedWorker : w));
      return updatedWorker;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <WorkerContext.Provider value={{
      workers,
      loading,
      error,
      addWorker,
      updateWorker,
      deleteWorker,
      getWorker,
      getActiveWorkers,
      toggleWorkerStatus,
      refreshWorkers: fetchWorkers,
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
