import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material';
import { Delete, CalendarMonth } from '@mui/icons-material';
import { useAttendance } from '../../context/AttendanceContext';
import { formatDisplayDate, getCurrentYear } from '../../utils/dateUtils';

const HolidayList = () => {
  const { holidays, deleteHoliday } = useAttendance();
  const [yearFilter, setYearFilter] = useState(getCurrentYear());

  const filteredHolidays = holidays
    .filter(h => h.year === yearFilter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (holidays.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <CalendarMonth sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No holidays added yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          कोई छुट्टी अभी तक नहीं जोड़ी गई
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Chip
          label={`Year: ${yearFilter}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date / तारीख</TableCell>
              <TableCell>Holiday Name / छुट्टी का नाम</TableCell>
              <TableCell align="right">Actions / कार्रवाई</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHolidays.map(holiday => (
              <TableRow key={holiday.id}>
                <TableCell>{formatDisplayDate(holiday.date)}</TableCell>
                <TableCell>{holiday.name}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete / हटाएं">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteHoliday(holiday.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Total Holidays: {filteredHolidays.length} / कुल छुट्टियां: {filteredHolidays.length}
      </Typography>
    </Box>
  );
};

export default HolidayList;
