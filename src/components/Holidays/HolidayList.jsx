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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Delete, CalendarMonth } from '@mui/icons-material';
import { useAttendance } from '../../context/AttendanceContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDisplayDate, getCurrentYear } from '../../utils/dateUtils';

const HolidayList = () => {
  const { holidays, deleteHoliday } = useAttendance();
  const { getText } = useLanguage();
  const [yearFilter, setYearFilter] = useState(getCurrentYear());
  const [deleteDialog, setDeleteDialog] = useState({ open: false, holiday: null });

  const filteredHolidays = holidays
    .filter(h => h.year === yearFilter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleDeleteClick = (holiday) => {
    setDeleteDialog({ open: true, holiday });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.holiday) {
      deleteHoliday(deleteDialog.holiday.id);
    }
    setDeleteDialog({ open: false, holiday: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, holiday: null });
  };

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
          {getText('No holidays added yet', 'कोई छुट्टी अभी तक नहीं जोड़ी गई')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Chip
          label={`${getText('Year', 'वर्ष')}: ${yearFilter}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{getText('Date', 'तारीख')}</TableCell>
              <TableCell>{getText('Holiday Name', 'छुट्टी का नाम')}</TableCell>
              <TableCell align="right">{getText('Actions', 'कार्रवाई')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHolidays.map(holiday => (
              <TableRow key={holiday.id}>
                <TableCell>{formatDisplayDate(holiday.date)}</TableCell>
                <TableCell>{holiday.name}</TableCell>
                <TableCell align="right">
                  <Tooltip title={getText('Delete', 'हटाएं')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(holiday)}
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
        {getText('Total Holidays', 'कुल छुट्टियां')}: {filteredHolidays.length}
      </Typography>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{getText('Delete Holiday', 'छुट्टी हटाएं')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getText(
              `Are you sure you want to delete the holiday "${deleteDialog.holiday?.name}"${deleteDialog.holiday?.date ? ` on ${formatDisplayDate(deleteDialog.holiday.date)}` : ''}?`,
              `क्या आप वाकई छुट्टी "${deleteDialog.holiday?.name}"${deleteDialog.holiday?.date ? ` ${formatDisplayDate(deleteDialog.holiday.date)} को` : ''} हटाना चाहते हैं?`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel}>
            {getText('Cancel', 'रद्द करें')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {getText('Delete', 'हटाएं')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HolidayList;
