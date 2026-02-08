import { createContext, useContext, useState, useEffect } from 'react';
import { showToast, getToastMessage, getToast } from '../utils/toast';
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

  const fetchAttendance = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceAPI.getAll(params);
      setAttendance(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching attendance:', err);
    }
    setLoading(false);
  };

  const fetchHolidays = async (year) => {
    try {
      const data = await holidaysAPI.getAll(year);
      setHolidays(data);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  const markAttendance = async (workerId, date, status, overtimeHours = 0) => {
    try {
      const record = await attendanceAPI.mark({ workerId, date, status, overtimeHours });

      // Refresh attendance data from server to ensure consistency
      await fetchAttendance();

      const statusLabel = status === 'present' ? 'Present ✓' : 'Absent ✗';
      showToast.success(`Marked ${statusLabel}`);

      return { success: true, record };
    } catch (err) {
      showToast.error('Failed to mark attendance');
      return { success: false, error: err.message };
    }
  };

  const bulkMarkAttendance = async (records) => {
    try {
      const result = await attendanceAPI.bulkMark(records);
      await fetchAttendance(); // Refresh attendance data
      showToast.success(getToastMessage(`${records.length} workers marked`, `${records.length} कर्मचारी चिह्नित`));
      return { success: true, result };
    } catch (err) {
      showToast.error(getToast('ATTENDANCE_FAILED'));
      return { success: false, error: err.message };
    }
  };

  const deleteAttendanceRecord = async (id) => {
    try {
      await attendanceAPI.delete(id);
      setAttendance(prev => prev.filter(a => a.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getAttendanceForDate = (date) => {
    return attendance.filter(a => a.date === date);
  };

  const getAttendanceForWorker = (workerId) => {
    return attendance.filter(a => a.workerId === workerId);
  };

  const getAttendanceForMonth = (year, month) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return attendance.filter(a => a.date.startsWith(monthStr));
  };

  const addHoliday = async (holidayData) => {
    try {
      const newHoliday = await holidaysAPI.create(holidayData);
      setHolidays(prev => [...prev, newHoliday]);
      showToast.success(getToast('HOLIDAY_ADDED'));
      return { success: true, holiday: newHoliday };
    } catch (err) {
      showToast.error(getToast('HOLIDAY_ADD_FAILED'));
      return { success: false, error: err.message };
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await holidaysAPI.delete(id);
      setHolidays(prev => prev.filter(h => h.id !== id));
      showToast.success(getToast('HOLIDAY_DELETED'));
      return { success: true };
    } catch (err) {
      showToast.error(getToast('HOLIDAY_DELETE_FAILED'));
      return { success: false, error: err.message };
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
      fetchAttendance,
      fetchHolidays,
      markAttendance,
      bulkMarkAttendance,
      deleteAttendanceRecord,
      getAttendanceForDate,
      getAttendanceForWorker,
      getAttendanceForMonth,
      addHoliday,
      deleteHoliday,
      isHoliday,
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
