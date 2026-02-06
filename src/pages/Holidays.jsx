import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import HolidayList from '../components/Holidays/HolidayList';
import HolidayForm from '../components/Holidays/HolidayForm';
import { useAttendance } from '../context/AttendanceContext';

const Holidays = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addHoliday } = useAttendance();
  const [formOpen, setFormOpen] = useState(false);

  const handleAdd = (data) => {
    addHoliday(data);
  };

  return (
    <Box sx={{ pb: isMobile ? 8 : 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Holidays / छुट्टियां
        </Typography>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Add Holiday / जोड़ें
          </Button>
        )}
      </Box>

      <HolidayList />

      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Add Holiday / छुट्टी जोड़ें
          </Button>
        </Box>
      )}

      <HolidayForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
    </Box>
  );
};

export default Holidays;
