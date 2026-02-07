import { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/calculations';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [contractor, setContractor] = useState(null);
  const [allContractors, setAllContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedContractors = storage.get(STORAGE_KEYS.CONTRACTORS) || [];
    setAllContractors(savedContractors);

    const savedContractor = storage.get(STORAGE_KEYS.CONTRACTOR);
    if (savedContractor && savedContractor.loggedIn) {
      setContractor(savedContractor);
    }
    setIsLoading(false);
  }, []);

  const signup = (data) => {
    const contractorData = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      age: data.age,
      companyName: data.companyName || '',
      establishedYear: data.establishedYear || null,
      createdAt: new Date().toISOString(),
      loggedIn: true,
    };

    const updatedContractors = [...allContractors, contractorData];
    storage.set(STORAGE_KEYS.CONTRACTORS, updatedContractors);
    storage.set(STORAGE_KEYS.CONTRACTOR, contractorData);
    setAllContractors(updatedContractors);
    setContractor(contractorData);
    return { success: true };
  };

  const login = (mobile) => {
    const existingContractor = allContractors.find(c => c.mobile === mobile);
    if (existingContractor) {
      const loggedInContractor = { ...existingContractor, loggedIn: true };
      storage.set(STORAGE_KEYS.CONTRACTOR, loggedInContractor);
      setContractor(loggedInContractor);
      return { success: true, contractor: loggedInContractor };
    }
    return { success: false, error: 'No account found with this mobile number' };
  };

  const logout = () => {
    const updatedData = { ...contractor, loggedIn: false };
    storage.set(STORAGE_KEYS.CONTRACTOR, updatedData);
    setContractor(null);
  };

  const updateProfile = (updates) => {
    const updatedData = { ...contractor, ...updates };
    storage.set(STORAGE_KEYS.CONTRACTOR, updatedData);

    const updatedContractors = allContractors.map(c =>
      c.id === contractor.id ? updatedData : c
    );
    storage.set(STORAGE_KEYS.CONTRACTORS, updatedContractors);
    setAllContractors(updatedContractors);
    setContractor(updatedData);
  };

  const checkMobileExists = (mobile) => {
    return allContractors.some(c => c.mobile === mobile);
  };

  return (
    <AuthContext.Provider value={{
      contractor,
      isAuthenticated: !!contractor,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      checkMobileExists,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
