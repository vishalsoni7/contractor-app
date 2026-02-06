import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import {
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
  getMonthNameHindi,
} from '../../utils/dateUtils';

const MonthlyReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { workers } = useWorkers();
  const { getAttendanceForMonth, holidays } = useAttendance();
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());

  const monthlyAttendance = getAttendanceForMonth(year, month);

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

  const getWorkerMonthlyStats = (workerId) => {
    const workerRecords = monthlyAttendance.filter(a => a.workerId === workerId);
    return {
      present: workerRecords.filter(a => a.status === 'present').length,
      absent: workerRecords.filter(a => a.status === 'absent').length,
      leave: workerRecords.filter(a => a.status === 'leave').length,
    };
  };

  const totalStats = workers.reduce(
    (acc, worker) => {
      const stats = getWorkerMonthlyStats(worker.id);
      return {
        present: acc.present + stats.present,
        absent: acc.absent + stats.absent,
        leave: acc.leave + stats.leave,
        totalSalary: acc.totalSalary + (stats.present * worker.dailyWage),
      };
    },
    { present: 0, absent: 0, leave: 0, totalSalary: 0 }
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant={isMobile ? 'subtitle1' : 'h5'} sx={{ minWidth: isMobile ? 150 : 200, textAlign: 'center' }}>
          {getMonthName(month)} {year} / {getMonthNameHindi(month)}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="primary.main">
                {workers.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Total Workers / कुल कर्मचारी
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="success.main">
                {totalStats.present}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Total Present / कुल उपस्थिति
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="warning.main">
                {holidays.filter(h => h.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Holidays / छुट्टियां
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'primary.main' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="white">
                ₹{totalStats.totalSalary.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Total Salary / कुल वेतन
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Worker-wise Summary / कर्मचारी वार सारांश
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'} sx={{ minWidth: isMobile ? 450 : 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Worker</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Rate</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>P</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>A</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>L</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map(worker => {
              const stats = getWorkerMonthlyStats(worker.id);
              const salary = stats.present * worker.dailyWage;
              return (
                <TableRow key={worker.id}>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    {worker.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>₹{worker.dailyWage}</TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="success.main" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{stats.present}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="error.main" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{stats.absent}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="warning.main" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{stats.leave}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                      ₹{salary.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell colSpan={2}>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  Total
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  {totalStats.present}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold" color="error.main" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  {totalStats.absent}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold" color="warning.main" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  {totalStats.leave}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" color="primary.main" fontWeight="bold" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  ₹{totalStats.totalSalary.toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MonthlyReport;
