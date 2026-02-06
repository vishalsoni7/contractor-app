import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  People,
  EventAvailable,
  CurrencyRupee,
  TrendingUp,
  Today,
} from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import {
  calculateMonthlyStats,
  getDailyAttendanceStats,
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
  const { workers, getActiveWorkers } = useWorkers();
  const { attendance, holidays, getAttendanceForMonth } = useAttendance();

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

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {getMonthName(currentMonth)} {currentYear} / {getMonthNameHindi(currentMonth)}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            title="Total Workers / कुल कर्मचारी"
            value={activeWorkers.length}
            subtitle={`${workers.length - activeWorkers.length} inactive`}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Today />}
            title="Present Today / आज उपस्थित"
            value={todayStats.present}
            subtitle={`${todayStats.absent} absent, ${todayStats.leave} on leave`}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventAvailable />}
            title="Total Present Days / कुल उपस्थिति"
            value={monthlyStats.totalPresentDays}
            subtitle={`This month`}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CurrencyRupee />}
            title="Total Wages / कुल मजदूरी"
            value={`₹${monthlyStats.totalSalary.toLocaleString()}`}
            subtitle={`This month`}
            color="warning"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Stats / त्वरित आंकड़े
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUp color="success" />
                  <Typography variant="subtitle1">
                    Average Daily Attendance
                  </Typography>
                </Box>
                <Typography variant="h5" color="success.main">
                  {monthlyStats.averageDailyAttendance} days/worker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  औसत दैनिक उपस्थिति
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CurrencyRupee color="primary" />
                  <Typography variant="subtitle1">
                    Average Wage Per Worker
                  </Typography>
                </Box>
                <Typography variant="h5" color="primary.main">
                  ₹{activeWorkers.length > 0
                    ? Math.round(monthlyStats.totalSalary / activeWorkers.length).toLocaleString()
                    : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  प्रति कर्मचारी औसत मजदूरी
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSummary;
