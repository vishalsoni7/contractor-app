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
  Avatar,
  Link,
} from '@mui/material';
import {
  Person,
  CurrencyRupee,
  CalendarToday,
  TrendingUp,
  LocationOn,
  AccessTime,
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

  const getGoogleMapsUrl = (location) => {
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  };

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
        {/* Photo Section */}
        {worker.photo && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Avatar
              src={worker.photo}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 1 }}
            />
            {worker.photoLocation && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <LocationOn fontSize="small" color="success" />
                <Link
                  href={getGoogleMapsUrl(worker.photoLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {worker.photoLocation.latitude.toFixed(4)}, {worker.photoLocation.longitude.toFixed(4)}
                </Link>
              </Box>
            )}
          </Box>
        )}

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
              icon={<AccessTime color="info" />}
              label="OT Hours / ओवरटाइम"
              value={`${stats.overtimeHours}h`}
              color="info.main"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatBox
              icon={<TrendingUp color="warning" />}
              label="Attendance %"
              value={`${stats.attendancePercentage}%`}
              color="warning.main"
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
              <Typography variant="h4">₹{stats.totalEarnings.toLocaleString()}</Typography>
              {stats.overtimePay > 0 && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  (includes ₹{Math.round(stats.overtimePay)} OT)
                </Typography>
              )}
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
