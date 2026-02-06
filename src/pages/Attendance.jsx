import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { EventAvailable, CalendarMonth } from '@mui/icons-material';
import DailyAttendance from '../components/Attendance/DailyAttendance';
import AttendanceCalendar from '../components/Attendance/AttendanceCalendar';

const Attendance = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance / हाज़िरी
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          variant="fullWidth"
        >
          <Tab
            icon={<EventAvailable />}
            label="Daily / दैनिक"
            iconPosition="start"
          />
          <Tab
            icon={<CalendarMonth />}
            label="Calendar / कैलेंडर"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {tab === 0 && <DailyAttendance />}
      {tab === 1 && <AttendanceCalendar />}
    </Box>
  );
};

export default Attendance;
