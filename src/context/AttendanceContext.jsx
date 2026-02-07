import { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/calculations';

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const savedAttendance = storage.get(STORAGE_KEYS.ATTENDANCE);
    const savedHolidays = storage.get(STORAGE_KEYS.HOLIDAYS);
    if (savedAttendance) setAttendance(savedAttendance);
    if (savedHolidays) setHolidays(savedHolidays);
  }, []);

  const saveAttendance = (newAttendance) => {
    storage.set(STORAGE_KEYS.ATTENDANCE, newAttendance);
    setAttendance(newAttendance);
  };

  const saveHolidays = (newHolidays) => {
    storage.set(STORAGE_KEYS.HOLIDAYS, newHolidays);
    setHolidays(newHolidays);
  };

  const markAttendance = (workerId, date, status, overtimeHours = 0) => {
    const existingIndex = attendance.findIndex(
      a => a.workerId === workerId && a.date === date
    );

    let updatedAttendance;
    if (existingIndex >= 0) {
      updatedAttendance = attendance.map((a, index) =>
        index === existingIndex ? { ...a, status, overtimeHours } : a
      );
    } else {
      const newRecord = {
        id: generateId(),
        workerId,
        date,
        status,
        overtimeHours,
      };
      updatedAttendance = [...attendance, newRecord];
    }
    saveAttendance(updatedAttendance);
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

  const addHoliday = (holidayData) => {
    const newHoliday = {
      id: generateId(),
      ...holidayData,
    };
    const updatedHolidays = [...holidays, newHoliday];
    saveHolidays(updatedHolidays);
    return newHoliday;
  };

  const deleteHoliday = (id) => {
    const updatedHolidays = holidays.filter(h => h.id !== id);
    saveHolidays(updatedHolidays);
  };

  const isHoliday = (date) => {
    return holidays.some(h => h.date === date);
  };

  return (
    <AttendanceContext.Provider value={{
      attendance,
      holidays,
      markAttendance,
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
