import { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/calculations';

const WorkerContext = createContext(null);

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const savedWorkers = storage.get(STORAGE_KEYS.WORKERS);
    if (savedWorkers) {
      setWorkers(savedWorkers);
    }
  }, []);

  const saveWorkers = (newWorkers) => {
    storage.set(STORAGE_KEYS.WORKERS, newWorkers);
    setWorkers(newWorkers);
  };

  const addWorker = (workerData) => {
    const newWorker = {
      id: generateId(),
      ...workerData,
      joiningDate: workerData.joiningDate || new Date().toISOString().split('T')[0],
      status: 'active',
    };
    const updatedWorkers = [...workers, newWorker];
    saveWorkers(updatedWorkers);
    return newWorker;
  };

  const updateWorker = (id, updates) => {
    const updatedWorkers = workers.map(w =>
      w.id === id ? { ...w, ...updates } : w
    );
    saveWorkers(updatedWorkers);
  };

  const deleteWorker = (id) => {
    const updatedWorkers = workers.filter(w => w.id !== id);
    saveWorkers(updatedWorkers);
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
      addWorker,
      updateWorker,
      deleteWorker,
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
