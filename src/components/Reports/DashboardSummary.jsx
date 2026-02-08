import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Button,
} from '@mui/material';
import {
  People,
  CurrencyRupee,
  Today,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import { useAdvances } from '../../context/AdvanceContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  calculateMonthlyStats,
  getDailyAttendanceStats,
  calculateOvertimePay,
} from '../../utils/calculations';
import {
  getTodayString,
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
  getMonthNameHindi,
} from '../../utils/dateUtils';

const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
  <Card
    sx={{
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.light`,
            color: `${color}.dark`,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardSummary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { workers, getActiveWorkers } = useWorkers();
  const { attendance, holidays, getAttendanceForMonth } = useAttendance();
  const { getTotalAdvancesForWorkerInMonth } = useAdvances();
  const { getText, isEnglish, isHindi } = useLanguage();
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [showAllWorkers, setShowAllWorkers] = useState(false);

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const today = getTodayString();

  const activeWorkers = getActiveWorkers();
  const monthlyAttendance = getAttendanceForMonth(currentYear, currentMonth);
  const monthlyStats = calculateMonthlyStats(
    workers,
    monthlyAttendance,
    holidays,
    currentYear,
    currentMonth
  );
  const todayStats = getDailyAttendanceStats(attendance, today);

  // Monthly report data
  const selectedMonthAttendance = getAttendanceForMonth(year, month);

  // Limit workers display
  const WORKERS_TO_SHOW = 6;
  const workersToDisplay = showAllWorkers ? workers : workers.slice(0, WORKERS_TO_SHOW);
  const hasMoreWorkers = workers.length > WORKERS_TO_SHOW;

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
    const workerRecords = selectedMonthAttendance.filter(a => a.workerId === worker.id);
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
        overtimeHours: acc.overtimeHours + stats.overtimeHours,
        grossSalary: acc.grossSalary + stats.grossSalary,
        advances: acc.advances + stats.advances,
        netSalary: acc.netSalary + stats.netSalary,
      };
    },
    { present: 0, absent: 0, overtimeHours: 0, grossSalary: 0, advances: 0, netSalary: 0 }
  );

  return (
    <Box>
      {/* Today's Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<People />}
            title={getText('Total Workers', 'कुल कर्मचारी')}
            value={activeWorkers.length}
            subtitle={`${workers.length - activeWorkers.length} ${getText('inactive', 'निष्क्रिय')}`}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<Today />}
            title={getText('Present Today', 'आज उपस्थित')}
            value={todayStats.present}
            subtitle={`${todayStats.absent} ${getText('absent', 'अनुपस्थित')}`}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<CurrencyRupee />}
            title={getText('Total Wages', 'कुल मजदूरी')}
            value={`₹${monthlyStats.totalSalary.toLocaleString()}`}
            subtitle={getText('This month', 'इस महीने')}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Monthly Summary Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
            {isEnglish && `${getMonthName(month)} ${getText('Summary', 'सारांश')}`}
            {isHindi && `${getMonthNameHindi(month)} ${getText('', 'सारांश')}`}
            {!isEnglish && !isHindi && `${getMonthName(month)} ${getText('Summary', 'सारांश')}`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handlePrevMonth} size="small">
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 100, textAlign: 'center', fontWeight: 'medium' }}>
              {isEnglish && `${getMonthName(month)} ${year}`}
              {isHindi && `${getMonthNameHindi(month)} ${year}`}
              {!isEnglish && !isHindi && `${getMonthName(month)} ${year}`}
            </Typography>
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Summary Cards - Consolidated */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="success.main" fontWeight="bold">
                  {totalStats.present}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {getText('Present Days', 'उपस्थिति दिन')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="info.main" fontWeight="bold">
                  {totalStats.overtimeHours}h
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {getText('Overtime', 'ओवरटाइम')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="error.main" fontWeight="bold">
                  ₹{totalStats.advances.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {getText('Advances', 'अग्रिम')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: 'primary.main', height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} color="white" fontWeight="bold">
                  ₹{totalStats.netSalary.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {getText('Net Salary', 'शुद्ध वेतन')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Worker-wise Details - Collapsible */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
            {getText('Worker-wise Details', 'कर्मचारी वार विवरण')}
          </Typography>

          <Grid container spacing={2}>
            {workersToDisplay.map(worker => {
              const stats = getWorkerMonthlyStats(worker);
              return (
                <Grid item xs={12} sm={6} md={4} key={worker.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ flex: 1 }}>
                          {worker.name}
                        </Typography>
                        <Chip 
                          label={`₹${worker.dailyWage}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {stats.present}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {getText('Days', 'दिन')}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant="body2" color="info.main" fontWeight="bold">
                            {stats.overtimeHours}h
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {getText('OT', 'ओटी')}
                          </Typography>
                        </Box>
                        {stats.advances > 0 && (
                          <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="body2" color="error.main" fontWeight="bold">
                              ₹{stats.advances}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                              {getText('Adv', 'अग्रिम')}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 1, 
                        bgcolor: 'primary.lighter', 
                        borderRadius: 1,
                        mt: 1
                      }}>
                        <Typography variant="body1" color="primary.main" fontWeight="bold">
                          ₹{stats.netSalary.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {getText('Net Pay', 'शुद्ध भुगतान')}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Show More/Less Button */}
          {hasMoreWorkers && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAllWorkers(!showAllWorkers)}
                sx={{ minWidth: 200 }}
              >
                {showAllWorkers 
                  ? getText('Show Less', 'कम दिखाएं')
                  : getText(`Show All (${workers.length} workers)`, `सभी दिखाएं (${workers.length} कर्मचारी)`)
                }
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardSummary;
