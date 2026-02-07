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
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    return record?.status || null;
  };

  const getOvertimeForDay = (date) => {
    const dateStr = formatDate(date);
    const record = monthlyAttendance.find(a => a.date === dateStr);
    return record?.overtimeHours || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success.main';
      case 'absent': return 'error.main';
      case 'leave': return 'warning.main';
      default: return 'grey.300';
    }
  };

  const getStatusLabel = (status, overtime) => {
    if (!status) return '';
    if (status === 'present') return overtime > 0 ? `P+${overtime}` : 'P';
    if (status === 'absent') return 'A';
    if (status === 'leave') return 'L';
    return '';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = days[0].getDay();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ width: isMobile ? '100%' : 200, mb: 2 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
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
          {/* Stats Cards */}
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

          {/* Calendar Grid View */}
          <Paper sx={{ p: 2 }}>
            {/* Week day headers */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              {weekDays.map(day => (
                <Grid item xs={12/7} key={day}>
                  <Typography
                    variant="caption"
                    align="center"
                    display="block"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Empty cells for days before the 1st */}
            <Grid container spacing={1}>
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <Grid item xs={12/7} key={`empty-${index}`}>
                  <Box sx={{ height: 48 }} />
                </Grid>
              ))}

              {/* Calendar days */}
              {days.map(day => {
                const status = getStatusForDay(day);
                const overtime = getOvertimeForDay(day);
                const isToday = formatDate(day) === formatDate(new Date());

                return (
                  <Grid item xs={12/7} key={day.toISOString()}>
                    <Box
                      sx={{
                        height: 48,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        bgcolor: status ? getStatusColor(status) : 'grey.100',
                        border: isToday ? 2 : 1,
                        borderColor: isToday ? 'primary.main' : 'divider',
                        position: 'relative',
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={status ? 'bold' : 'normal'}
                        color={status ? 'white' : 'text.secondary'}
                      >
                        {day.getDate()}
                      </Typography>
                      {status && (
                        <Typography
                          variant="caption"
                          color="white"
                          sx={{ fontSize: '0.65rem', lineHeight: 1 }}
                        >
                          {getStatusLabel(status, overtime)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: 0.5 }} />
                <Typography variant="caption">Present</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: 0.5 }} />
                <Typography variant="caption">Absent</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'warning.main', borderRadius: 0.5 }} />
                <Typography variant="caption">Leave</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'grey.100', border: 1, borderColor: 'divider', borderRadius: 0.5 }} />
                <Typography variant="caption">Not Marked</Typography>
              </Box>
            </Box>
          </Paper>
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
