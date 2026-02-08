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
import { useLanguage } from '../context/LanguageContext';

const Attendance = () => {
  const [tab, setTab] = useState(0);
  const { getText } = useLanguage();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {getText('Attendance', 'हाज़िरी')}
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          variant="fullWidth"
        >
          <Tab
            icon={<EventAvailable />}
            label={getText('Daily', 'दैनिक')}
            iconPosition="start"
          />
          <Tab
            icon={<CalendarMonth />}
            label={getText('Calendar', 'कैलेंडर')}
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
