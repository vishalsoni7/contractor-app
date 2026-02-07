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
import { useAdvances } from '../../context/AdvanceContext';
import { calculateOvertimePay } from '../../utils/calculations';
import {
  getMonthDays,
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
  formatDate,
} from '../../utils/dateUtils';

const WorkerReport = () => {
  const { workers } = useWorkers();
  const { getAttendanceForWorker } = useAttendance();
  const { getTotalAdvancesForWorkerInMonth } = useAdvances();
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
    overtimeHours: monthlyAttendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0),
  };

  const baseSalary = worker ? monthStats.present * worker.dailyWage : 0;
  const overtimePay = worker ? calculateOvertimePay(worker, monthStats.overtimeHours) : 0;
  const grossEarnings = baseSalary + overtimePay;
  const advanceDeduction = selectedWorker ? getTotalAdvancesForWorkerInMonth(selectedWorker, year, month) : 0;
  const netEarnings = grossEarnings - advanceDeduction;

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

  const getOvertimeForDay = (date) => {
    const dateStr = formatDate(date);
    const record = monthlyAttendance.find(a => a.date === dateStr);
    return record?.overtimeHours || 0;
  };

  const getStatusChip = (status, overtime) => {
    const label = status === 'present' ? (overtime > 0 ? `P+${overtime}` : 'P') :
                  status === 'absent' ? 'A' :
                  status === 'leave' ? 'L' : '-';
    const color = status === 'present' ? 'success' :
                  status === 'absent' ? 'error' :
                  status === 'leave' ? 'warning' : 'default';

    if (status === '-' || !status) {
      return <Typography variant="body2" color="text.disabled">-</Typography>;
    }
    return <Chip label={label} size="small" color={color} />;
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
            <Grid item xs={6} sm={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h5" color="success.main">
                    {monthStats.present}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Present / उपस्थित
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h5" color="error.main">
                    {monthStats.absent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Absent / अनुपस्थित
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h5" color="info.main">
                    {monthStats.overtimeHours}h
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    OT / ओवरटाइम
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h5" color="error.main">
                    ₹{advanceDeduction.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Advance / अग्रिम
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'primary.main' }}>
                <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h5" color="white">
                    ₹{netEarnings.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Net Pay / शुद्ध वेतन
                  </Typography>
                  {(overtimePay > 0 || advanceDeduction > 0) && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                      (Gross: ₹{grossEarnings.toLocaleString()})
                    </Typography>
                  )}
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
                      {getStatusChip(getStatusForDay(day), getOvertimeForDay(day))}
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
