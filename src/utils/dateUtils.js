import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

export const formatDisplayDate = (date) => {
  return formatDate(date, 'dd MMM yyyy');
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export const getMonthDays = (year, month) => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end });
};

export const getWorkingDaysInMonth = (year, month, holidays = []) => {
  const days = getMonthDays(year, month);
  return days.filter(day => {
    if (isWeekend(day)) return false;
    const isHoliday = holidays.some(h => isSameDay(parseISO(h.date), day));
    return !isHoliday;
  });
};

export const getTodayString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getCurrentMonth = () => {
  return new Date().getMonth();
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getMonthNameHindi = (month) => {
  const months = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  return months[month];
};
