import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAdvances } from '../../context/AdvanceContext';
import { formatDisplayDate } from '../../utils/dateUtils';

const AdvanceList = ({ workerId = null, showWorkerName = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { workers } = useWorkers();
  const { advances, deleteAdvance, getAdvancesForWorker } = useAdvances();

  const displayAdvances = workerId
    ? getAdvancesForWorker(workerId)
    : advances;

  const sortedAdvances = [...displayAdvances].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const getWorkerName = (wId) => {
    const worker = workers.find(w => w.id === wId);
    return worker?.name || 'Unknown';
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this advance? / क्या आप इस अग्रिम को हटाना चाहते हैं?')) {
      deleteAdvance(id);
    }
  };

  if (sortedAdvances.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No advances recorded
        </Typography>
        <Typography variant="body2" color="text.secondary">
          कोई अग्रिम दर्ज नहीं है
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Date / तारीख</TableCell>
            {showWorkerName && (
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Worker / कर्मचारी</TableCell>
            )}
            <TableCell align="right" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Amount / राशि</TableCell>
            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Reason / कारण</TableCell>
            <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAdvances.map(advance => (
            <TableRow key={advance.id}>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                {formatDisplayDate(advance.date)}
              </TableCell>
              {showWorkerName && (
                <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  {getWorkerName(advance.workerId)}
                </TableCell>
              )}
              <TableCell align="right">
                <Chip
                  label={`₹${advance.amount.toLocaleString()}`}
                  color="error"
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                {advance.reason || '-'}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(advance.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdvanceList;
