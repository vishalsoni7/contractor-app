import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Chip,
  Alert,
  IconButton,
  Checkbox,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
} from '@mui/material';
import {
  Check,
  Close,
  Add,
  Remove,
  AccessTime,
  SelectAll,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTodayString, formatDisplayDate, formatTimeRange } from '../../utils/dateUtils';
import { getDailyAttendanceStats } from '../../utils/calculations';

// Mobile Card Component for Worker Attendance
const WorkerAttendanceCard = ({ worker, status, overtime, isSelected, onSelect, onStatusChange, onOvertimeChange, getText }) => {
  const isPresent = status === 'present';
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isSelected ? 2 : 0, 
        borderColor: 'primary.main',
        bgcolor: isSelected ? 'action.selected' : 'background.paper' 
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
            sx={{ p: 0, mt: 0.5 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {worker.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              <Chip 
                label={`₹${worker.dailyWage}`} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
              <Chip 
                label={formatTimeRange(worker.workStartTime, worker.workEndTime)} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Status Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {getText('Status', 'स्थिति')}
          </Typography>
          <ToggleButtonGroup
            value={status}
            exclusive
            onChange={(e, newStatus) => onStatusChange(newStatus)}
            size="small"
            fullWidth
          >
            <ToggleButton 
              value="present"
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'success.main',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'success.dark',
                  },
                },
              }}
            >
              <CheckCircle sx={{ mr: 0.5, fontSize: '1rem' }} />
              {getText('Present', 'उपस्थित')}
            </ToggleButton>
            <ToggleButton 
              value="absent"
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'error.main',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                },
              }}
            >
              <Cancel sx={{ mr: 0.5, fontSize: '1rem' }} />
              {getText('Absent', 'अनुपस्थित')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Overtime Controls */}
        {isPresent && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {getText('Overtime', 'ओवरटाइम')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onOvertimeChange(-0.5)}
                disabled={overtime <= 0}
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Chip
                icon={<AccessTime />}
                label={`${overtime} ${getText('hours', 'घंटे')}`}
                color={overtime > 0 ? 'info' : 'default'}
                sx={{ flex: 1, fontSize: '0.875rem' }}
              />
              <IconButton
                size="small"
                onClick={() => onOvertimeChange(0.5)}
                disabled={overtime >= 12}
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DailyAttendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { getActiveWorkers } = useWorkers();
  const { attendance, markAttendance, bulkMarkAttendance, getAttendanceForDate, isHoliday } = useAttendance();
  const { getText } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  const activeWorkers = getActiveWorkers();
  const dayAttendance = getAttendanceForDate(selectedDate);
  const stats = getDailyAttendanceStats(attendance, selectedDate);
  const holidayToday = isHoliday(selectedDate);

  const getWorkerStatus = (workerId) => {
    const record = dayAttendance.find(a => String(a.workerId) === String(workerId));
    return record?.status || null;
  };

  const getWorkerOvertime = (workerId) => {
    const record = dayAttendance.find(a => String(a.workerId) === String(workerId));
    return record?.overtimeHours || 0;
  };

  const handleStatusChange = (workerId, newStatus) => {
    if (newStatus !== null) {
      const currentOvertime = getWorkerOvertime(workerId);
      const overtime = newStatus === 'present' ? currentOvertime : 0;
      markAttendance(workerId, selectedDate, newStatus, overtime);
    }
  };

  const handleOvertimeChange = (workerId, delta) => {
    const currentStatus = getWorkerStatus(workerId);
    if (currentStatus !== 'present') return;

    const currentOvertime = getWorkerOvertime(workerId);
    const newOvertime = Math.max(0, Math.min(12, currentOvertime + delta));
    markAttendance(workerId, selectedDate, currentStatus, newOvertime);
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedWorkers.length === activeWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(activeWorkers.map(w => w.id));
    }
  };

  const handleSelectWorker = (workerId) => {
    setSelectedWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const isAllSelected = activeWorkers.length > 0 && selectedWorkers.length === activeWorkers.length;
  const isSomeSelected = selectedWorkers.length > 0 && selectedWorkers.length < activeWorkers.length;

  // Bulk action handler
  const handleBulkAction = async (status) => {
    if (selectedWorkers.length === 0) return;

    const records = selectedWorkers.map(workerId => {
      // Preserve existing overtime for 'present' status, reset to 0 for other statuses
      const currentOvertime = getWorkerOvertime(workerId);
      const overtime = status === 'present' ? currentOvertime : 0;

      return {
        workerId,
        date: selectedDate,
        status,
        overtimeHours: overtime,
      };
    });

    await bulkMarkAttendance(records);
    setSelectedWorkers([]); // Clear selection after bulk action
  };

  if (activeWorkers.length === 0) {
    return (
      <Alert severity="info">
        {getText(
          'No active workers. Add workers first to mark attendance.',
          'कोई सक्रिय कर्मचारी नहीं। हाज़िरी लगाने के लिए पहले कर्मचारी जोड़ें।'
        )}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          type="date"
          label={getText('Select Date', 'तारीख चुनें')}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        {holidayToday && (
          <Chip label={getText('Holiday', 'छुट्टी')} color="warning" />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<Check />}
          label={`${getText('Present', 'उपस्थित')}: ${stats.present}`}
          color="success"
          variant="outlined"
        />
        <Chip
          icon={<Close />}
          label={`${getText('Absent', 'अनुपस्थित')}: ${stats.absent}`}
          color="error"
          variant="outlined"
        />
        {stats.totalOvertimeHours > 0 && (
          <Chip
            icon={<AccessTime />}
            label={`${getText('OT', 'ओटी')}: ${stats.totalOvertimeHours}${getText('h', 'घं')}`}
            color="info"
            variant="outlined"
          />
        )}
      </Box>

      {/* Bulk Actions */}
      {selectedWorkers.length > 0 && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" fontWeight="medium">
            {selectedWorkers.length} {getText('selected', 'चयनित')}
          </Typography>
          <ButtonGroup size="small" variant="contained">
            <Button
              color="success"
              onClick={() => handleBulkAction('present')}
              startIcon={<Check />}
            >
              {getText('Present', 'उपस्थित')}
            </Button>
            <Button
              color="error"
              onClick={() => handleBulkAction('absent')}
              startIcon={<Close />}
            >
              {getText('Absent', 'अनुपस्थित')}
            </Button>
          </ButtonGroup>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedWorkers([])}
          >
            {getText('Clear', 'साफ़')}
          </Button>
        </Box>
      )}

      {/* Select All Button for Mobile */}
      {isMobile && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {activeWorkers.length} {getText('Workers', 'कर्मचारी')}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SelectAll />}
            onClick={handleSelectAll}
          >
            {isAllSelected ? getText('Deselect All', 'सभी हटाएं') : getText('Select All', 'सभी चुनें')}
          </Button>
        </Box>
      )}

      {/* Mobile View - Cards */}
      {isMobile ? (
        <Box>
          {activeWorkers.map(worker => {
            const status = getWorkerStatus(worker.id);
            const overtime = getWorkerOvertime(worker.id);
            const isSelected = selectedWorkers.includes(worker.id);

            return (
              <WorkerAttendanceCard
                key={worker.id}
                worker={worker}
                status={status}
                overtime={overtime}
                isSelected={isSelected}
                onSelect={() => handleSelectWorker(worker.id)}
                onStatusChange={(newStatus) => handleStatusChange(worker.id, newStatus)}
                onOvertimeChange={(delta) => handleOvertimeChange(worker.id, delta)}
                getText={getText}
              />
            );
          })}
        </Box>
      ) : (
        /* Desktop View - Table */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all workers' }}
                  />
                </TableCell>
                <TableCell>{getText('Worker', 'कर्मचारी')}</TableCell>
                <TableCell>{getText('Daily Wage', 'मजदूरी')}</TableCell>
                <TableCell>{getText('Work Hours', 'समय')}</TableCell>
                <TableCell align="center">{getText('Status', 'स्थिति')}</TableCell>
                <TableCell align="center">{getText('Overtime', 'ओवरटाइम')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeWorkers.map(worker => {
                const status = getWorkerStatus(worker.id);
                const overtime = getWorkerOvertime(worker.id);
                const isPresent = status === 'present';
                const isSelected = selectedWorkers.includes(worker.id);

                return (
                  <TableRow
                    key={worker.id}
                    selected={isSelected}
                    sx={{ '&.Mui-selected': { bgcolor: 'action.selected' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectWorker(worker.id)}
                        inputProps={{ 'aria-label': `select ${worker.name}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{worker.name}</Typography>
                    </TableCell>
                    <TableCell>₹{worker.dailyWage}</TableCell>
                    <TableCell>
                      {formatTimeRange(worker.workStartTime, worker.workEndTime)}
                    </TableCell>
                    <TableCell align="center">
                      <ToggleButtonGroup
                        value={status}
                        exclusive
                        onChange={(e, newStatus) => handleStatusChange(worker.id, newStatus)}
                        size="small"
                      >
                        <ToggleButton 
                          value="present"
                          sx={{
                            '&.Mui-selected': {
                              bgcolor: 'success.main',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: 'success.dark',
                              },
                            },
                          }}
                        >
                          <Check fontSize="small" />
                        </ToggleButton>
                        <ToggleButton 
                          value="absent"
                          sx={{
                            '&.Mui-selected': {
                              bgcolor: 'error.main',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: 'error.dark',
                              },
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                    <TableCell align="center">
                      {isPresent ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOvertimeChange(worker.id, -0.5)}
                            disabled={overtime <= 0}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Chip
                            label={`${overtime}h`}
                            size="small"
                            color={overtime > 0 ? 'info' : 'default'}
                            sx={{ minWidth: 50 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleOvertimeChange(worker.id, 0.5)}
                            disabled={overtime >= 12}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DailyAttendance;
