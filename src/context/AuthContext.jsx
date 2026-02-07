import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setToken, removeToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [contractor, setContractor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and fetch profile on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('kaamgar_token');
      if (token) {
        try {
          const profile = await authAPI.getProfile();
          setContractor(profile);
        } catch (error) {
          // Token expired or invalid
          removeToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    try {
      const result = await authAPI.login(email, password);
      if (result.success) {
        setToken(result.token);
        setContractor(result.contractor);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register new contractor
  const register = async (data) => {
    try {
      const result = await authAPI.register(data);
      if (result.success) {
        setToken(result.token);
        setContractor(result.contractor);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    removeToken();
    setContractor(null);
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const result = await authAPI.updateProfile(updates);
      setContractor(result);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      contractor,
      isAuthenticated: !!contractor,
      isLoading,
      login,
      register,
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
