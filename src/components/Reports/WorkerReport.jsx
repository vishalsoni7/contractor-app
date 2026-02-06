import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getWorkerStats } from '../../utils/calculations';
import {
  getMonthDays,
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
  getMonthNameHindi,
  formatDate,
} from '../../utils/dateUtils';

const WorkerReport = () => {
  const { workers } = useWorkers();
  const { getAttendanceForWorker, holidays } = useAttendance();
  const [selectedWorker, setSelectedWorker] = useState('');
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());

  const worker = workers.find(w => w.id === selectedWorker);
  const workerAttendance = selectedWorker ? getAttendanceForWorker(selectedWorker) : [];
  const days = getMonthDays(year, month);

  const monthlyAttendance = workerAttendance.filter(a => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return a.date.startsWith(monthStr);
  });

  const monthStats = {
    present: monthlyAttendance.filter(a => a.status === 'present').length,
    absent: monthlyAttendance.filter(a => a.status === 'absent').length,
    leave: monthlyAttendance.filter(a => a.status === 'leave').length,
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

  const getStatusForDay = (date) => {
    const dateStr = formatDate(date);
    const record = monthlyAttendance.find(a => a.date === dateStr);
    return record?.status || '-';
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'present':
        return <Chip label="P" size="small" color="success" />;
      case 'absent':
        return <Chip label="A" size="small" color="error" />;
      case 'leave':
        return <Chip label="L" size="small" color="warning" />;
      default:
        return <Typography variant="body2" color="text.disabled">-</Typography>;
    }
  };

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
            {workers.map(w => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="subtitle1" sx={{ minWidth: 160, textAlign: 'center' }}>
            {getMonthName(month)} {year}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {worker && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {monthStats.present}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Present / उपस्थित
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {monthStats.absent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Absent / अनुपस्थित
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {monthStats.leave}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Leave / छुट्टी
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'primary.main' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="white">
                    ₹{monthStats.present * worker.dailyWage}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Earned / कमाई
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {days.map(day => (
                    <TableCell key={day.toISOString()} align="center" sx={{ p: 0.5 }}>
                      <Typography variant="caption">
                        {day.getDate()}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {days.map(day => (
                    <TableCell key={day.toISOString()} align="center" sx={{ p: 0.5 }}>
                      {getStatusChip(getStatusForDay(day))}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {!selectedWorker && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            Select a worker to view their report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            रिपोर्ट देखने के लिए एक कर्मचारी चुनें
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WorkerReport;
