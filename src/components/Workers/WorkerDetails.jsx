import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person,
  CurrencyRupee,
  AccessTime,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { useAttendance } from '../../context/AttendanceContext';
import { getWorkerStats } from '../../utils/calculations';
import { formatDisplayDate, formatTimeRange } from '../../utils/dateUtils';

const StatBox = ({ icon, label, value, color = 'text.primary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" color={color}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const WorkerDetails = ({ open, onClose, worker }) => {
  const { attendance } = useAttendance();

  if (!worker) return null;

  const stats = getWorkerStats(worker, attendance);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person color="primary" />
          {worker.name}
          <Chip
            label={worker.status === 'active' ? 'Active' : 'Inactive'}
            color={worker.status === 'active' ? 'success' : 'default'}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Age / उम्र
            </Typography>
            <Typography variant="body1">{worker.age} years</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Daily Wage / दैनिक मजदूरी
            </Typography>
            <Typography variant="body1">₹{worker.dailyWage}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Work Hours / काम के घंटे
            </Typography>
            <Typography variant="body1">
              {formatTimeRange(worker.workStartTime, worker.workEndTime)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Joining Date / शामिल होने की तारीख
            </Typography>
            <Typography variant="body1">
              {formatDisplayDate(worker.joiningDate)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Attendance Summary / हाज़िरी सारांश
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <StatBox
              icon={<CalendarToday color="success" />}
              label="Present / उपस्थित"
              value={stats.present}
              color="success.main"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatBox
              icon={<CalendarToday color="error" />}
              label="Absent / अनुपस्थित"
              value={stats.absent}
              color="error.main"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatBox
              icon={<CalendarToday color="warning" />}
              label="Leave / छुट्टी"
              value={stats.leave}
              color="warning.main"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatBox
              icon={<TrendingUp color="info" />}
              label="Attendance %"
              value={`${stats.attendancePercentage}%`}
              color="info.main"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'primary.main',
            borderRadius: 2,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyRupee />
            <Box>
              <Typography variant="body2">Total Earnings / कुल कमाई</Typography>
              <Typography variant="h4">₹{stats.totalEarnings}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close / बंद करें</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerDetails;
