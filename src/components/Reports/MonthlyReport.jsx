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
import { useAdvances } from '../../context/AdvanceContext';
import { calculateOvertimePay } from '../../utils/calculations';
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
  const { getAttendanceForMonth } = useAttendance();
  const { getTotalAdvancesForWorkerInMonth } = useAdvances();
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

  const getWorkerMonthlyStats = (worker) => {
    const workerRecords = monthlyAttendance.filter(a => a.workerId === worker.id);
    const present = workerRecords.filter(a => a.status === 'present').length;
    const overtimeHours = workerRecords.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
    const baseSalary = present * worker.dailyWage;
    const overtimePay = calculateOvertimePay(worker, overtimeHours);
    const grossSalary = baseSalary + overtimePay;
    const advances = getTotalAdvancesForWorkerInMonth(worker.id, year, month);
    const netSalary = grossSalary - advances;

    return {
      present,
      absent: workerRecords.filter(a => a.status === 'absent').length,
      leave: workerRecords.filter(a => a.status === 'leave').length,
      overtimeHours,
      baseSalary,
      overtimePay,
      grossSalary,
      advances,
      netSalary,
    };
  };

  const totalStats = workers.reduce(
    (acc, worker) => {
      const stats = getWorkerMonthlyStats(worker);
      return {
        present: acc.present + stats.present,
        absent: acc.absent + stats.absent,
        leave: acc.leave + stats.leave,
        overtimeHours: acc.overtimeHours + stats.overtimeHours,
        grossSalary: acc.grossSalary + stats.grossSalary,
        advances: acc.advances + stats.advances,
        netSalary: acc.netSalary + stats.netSalary,
      };
    },
    { present: 0, absent: 0, leave: 0, overtimeHours: 0, grossSalary: 0, advances: 0, netSalary: 0 }
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
              <Typography variant={isMobile ? 'h5' : 'h4'} color="info.main">
                {totalStats.overtimeHours}h
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Total OT / कुल ओवरटाइम
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="error.main">
                ₹{totalStats.advances.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Advances / अग्रिम
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'primary.main' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="white">
                ₹{totalStats.netSalary.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Net Salary / शुद्ध वेतन
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Worker-wise Summary / कर्मचारी वार सारांश
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'} sx={{ minWidth: isMobile ? 550 : 750 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>Worker</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>Rate</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>P</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>OT</TableCell>
              <TableCell align="center" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem', color: 'error.main' }}>Adv</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map(worker => {
              const stats = getWorkerMonthlyStats(worker);
              return (
                <TableRow key={worker.id}>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                    {worker.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>₹{worker.dailyWage}</TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="success.main" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{stats.present}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="info.main" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{stats.overtimeHours}h</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="error.main" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                      {stats.advances > 0 ? `₹${stats.advances.toLocaleString()}` : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                      ₹{stats.netSalary.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell colSpan={2}>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                  Total
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                  {totalStats.present}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold" color="info.main" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                  {totalStats.overtimeHours}h
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold" color="error.main" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                  ₹{totalStats.advances.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" color="primary.main" fontWeight="bold" sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                  ₹{totalStats.netSalary.toLocaleString()}
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
