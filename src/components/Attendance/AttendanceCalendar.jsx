import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import {
  getMonthDays,
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
  getMonthNameHindi,
  formatDate,
} from '../../utils/dateUtils';

const AttendanceCalendar = () => {
  const { workers } = useWorkers();
  const { getAttendanceForWorker, holidays } = useAttendance();
  const [selectedWorker, setSelectedWorker] = useState('');
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());

  const days = getMonthDays(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const workerAttendance = selectedWorker
    ? getAttendanceForWorker(selectedWorker)
    : [];

  const getStatusForDay = (date) => {
    const dateStr = formatDate(date);
    const record = workerAttendance.find(a => a.date === dateStr);
    const isHoliday = holidays.some(h => h.date === dateStr);
    if (isHoliday) return 'holiday';
    return record?.status || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success.light';
      case 'absent': return 'error.light';
      case 'leave': return 'warning.light';
      case 'holiday': return 'info.light';
      default: return 'background.paper';
    }
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const firstDayOfMonth = days[0].getDay();

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Worker / कर्मचारी चुनें</InputLabel>
          <Select
            value={selectedWorker}
            label="Select Worker / कर्मचारी चुनें"
            onChange={(e) => setSelectedWorker(e.target.value)}
          >
            {workers.map(worker => (
              <MenuItem key={worker.id} value={worker.id}>
                {worker.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 180, textAlign: 'center' }}>
            {getMonthName(month)} {year} / {getMonthNameHindi(month)}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip label="Present" size="small" sx={{ bgcolor: 'success.light' }} />
        <Chip label="Absent" size="small" sx={{ bgcolor: 'error.light' }} />
        <Chip label="Leave" size="small" sx={{ bgcolor: 'warning.light' }} />
        <Chip label="Holiday" size="small" sx={{ bgcolor: 'info.light' }} />
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          {weekDays.map(day => (
            <Grid item xs={12/7} key={day}>
              <Typography
                variant="caption"
                align="center"
                display="block"
                fontWeight="bold"
              >
                {day}
              </Typography>
            </Grid>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <Grid item xs={12/7} key={`empty-${index}`}>
              <Box sx={{ height: 40 }} />
            </Grid>
          ))}

          {days.map(day => {
            const status = selectedWorker ? getStatusForDay(day) : null;
            return (
              <Grid item xs={12/7} key={day.toISOString()}>
                <Box
                  sx={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    bgcolor: getStatusColor(status),
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2">
                    {day.getDate()}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AttendanceCalendar;
