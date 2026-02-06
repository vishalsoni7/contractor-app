import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import {
  Check,
  Close,
  EventBusy,
} from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getTodayString, formatDisplayDate, formatTimeRange } from '../../utils/dateUtils';
import { getDailyAttendanceStats } from '../../utils/calculations';

const DailyAttendance = () => {
  const { workers, getActiveWorkers } = useWorkers();
  const { attendance, markAttendance, getAttendanceForDate, isHoliday } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const activeWorkers = getActiveWorkers();
  const dayAttendance = getAttendanceForDate(selectedDate);
  const stats = getDailyAttendanceStats(attendance, selectedDate);
  const holidayToday = isHoliday(selectedDate);

  const getWorkerStatus = (workerId) => {
    const record = dayAttendance.find(a => a.workerId === workerId);
    return record?.status || null;
  };

  const handleStatusChange = (workerId, newStatus) => {
    if (newStatus !== null) {
      markAttendance(workerId, selectedDate, newStatus);
    }
  };

  if (activeWorkers.length === 0) {
    return (
      <Alert severity="info">
        No active workers. Add workers first to mark attendance.
        <br />
        कोई सक्रिय कर्मचारी नहीं। हाज़िरी लगाने के लिए पहले कर्मचारी जोड़ें।
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          type="date"
          label="Select Date / तारीख चुनें"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Typography variant="body1">
          {formatDisplayDate(selectedDate)}
        </Typography>
        {holidayToday && (
          <Chip label="Holiday / छुट्टी" color="warning" />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<Check />}
          label={`Present: ${stats.present}`}
          color="success"
          variant="outlined"
        />
        <Chip
          icon={<Close />}
          label={`Absent: ${stats.absent}`}
          color="error"
          variant="outlined"
        />
        <Chip
          icon={<EventBusy />}
          label={`Leave: ${stats.leave}`}
          color="warning"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Worker / कर्मचारी</TableCell>
              <TableCell>Daily Wage / मजदूरी</TableCell>
              <TableCell>Work Hours / समय</TableCell>
              <TableCell align="center">Status / स्थिति</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeWorkers.map(worker => (
              <TableRow key={worker.id}>
                <TableCell>
                  <Typography variant="body1">{worker.name}</Typography>
                </TableCell>
                <TableCell>₹{worker.dailyWage}</TableCell>
                <TableCell>
                  {formatTimeRange(worker.workStartTime, worker.workEndTime)}
                </TableCell>
                <TableCell align="center">
                  <ToggleButtonGroup
                    value={getWorkerStatus(worker.id)}
                    exclusive
                    onChange={(e, newStatus) => handleStatusChange(worker.id, newStatus)}
                    size="small"
                  >
                    <ToggleButton value="present" color="success">
                      <Check fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="absent" color="error">
                      <Close fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="leave" color="warning">
                      <EventBusy fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DailyAttendance;
