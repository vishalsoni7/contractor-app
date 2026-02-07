import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [contractor, setContractor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in (token exists)
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get profile
      authAPI.getProfile()
        .then((data) => {
          setContractor(data);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const signup = async (data) => {
    try {
      setError(null);
      const response = await authAPI.register({
        companyName: data.companyName,
        email: data.email,
        password: data.password,
        phone: data.phone || data.mobile,
      });

      localStorage.setItem('token', response.token);
      setContractor(response.contractor);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });

      localStorage.setItem('token', response.token);
      setContractor(response.contractor);
      return { success: true, contractor: response.contractor };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setContractor(null);
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const updatedContractor = await authAPI.updateProfile(updates);
      setContractor(updatedContractor);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      contractor,
      isAuthenticated: !!contractor,
      isLoading,
      error,
      login,
      signup,
      logout,
      updateProfile,
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
