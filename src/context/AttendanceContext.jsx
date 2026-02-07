import { createContext, useContext, useState, useEffect } from 'react';
import { attendanceAPI, holidaysAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAttendance();
      fetchHolidays();
    } else {
      setAttendance([]);
      setHolidays([]);
    }
  }, [isAuthenticated]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceAPI.getAll();
      setAttendance(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      const data = await holidaysAPI.getAll();
      setHolidays(data);
    } catch (err) {
      console.error('Failed to fetch holidays:', err);
    }
  };

  const markAttendance = async (workerId, date, status, overtimeHours = 0) => {
    try {
      setError(null);
      const record = await attendanceAPI.mark({ workerId, date, status, overtimeHours });

      // Update local state
      setAttendance(prev => {
        const existingIndex = prev.findIndex(
          a => a.workerId === workerId && a.date === date
        );
        if (existingIndex >= 0) {
          return prev.map((a, index) => index === existingIndex ? record : a);
        }
        return [...prev, record];
      });

      return record;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAttendanceForDate = (date) => {
    return attendance.filter(a => a.date === date);
  };

  const getAttendanceForWorker = (workerId) => {
    return attendance.filter(a => a.workerId === workerId || a.workerId?._id === workerId);
  };

  const getAttendanceForMonth = (year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return attendance.filter(a => a.date.startsWith(monthStr));
  };

  const addHoliday = async (holidayData) => {
    try {
      setError(null);
      const newHoliday = await holidaysAPI.create(holidayData);
      setHolidays(prev => [...prev, newHoliday]);
      return newHoliday;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteHoliday = async (id) => {
    try {
      setError(null);
      await holidaysAPI.delete(id);
      setHolidays(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isHoliday = (date) => {
    return holidays.some(h => h.date === date);
  };

  return (
    <AttendanceContext.Provider value={{
      attendance,
      holidays,
      loading,
      error,
      markAttendance,
      getAttendanceForDate,
      getAttendanceForWorker,
      getAttendanceForMonth,
      addHoliday,
      deleteHoliday,
      isHoliday,
      refreshAttendance: fetchAttendance,
      refreshHolidays: fetchHolidays,
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
