import { useState } from 'react';
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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Delete, Search, Clear } from '@mui/icons-material';
import { useWorkers } from '../../context/WorkerContext';
import { useAdvances } from '../../context/AdvanceContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDisplayDate } from '../../utils/dateUtils';

const AdvanceList = ({ workerId = null, showWorkerName = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { workers } = useWorkers();
  const { advances, deleteAdvance, getAdvancesForWorker } = useAdvances();
  const { getText } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, advance: null });

  const displayAdvances = workerId
    ? getAdvancesForWorker(workerId)
    : advances;

  const getWorkerName = (wId) => {
    const worker = workers.find(w => w.id === wId);
    return worker?.name || 'Unknown';
  };

  // Filter advances based on search query
  const filteredAdvances = displayAdvances.filter(advance => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const workerName = getWorkerName(advance.workerId).toLowerCase();
    const reason = (advance.reason || '').toLowerCase();
    const amount = advance.amount.toString();
    const date = formatDisplayDate(advance.date).toLowerCase();

    return (
      workerName.includes(query) ||
      reason.includes(query) ||
      amount.includes(query) ||
      date.includes(query)
    );
  });

  const sortedAdvances = [...filteredAdvances].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleDeleteClick = (advance) => {
    setDeleteDialog({ open: true, advance });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.advance) {
      deleteAdvance(deleteDialog.advance.id);
    }
    setDeleteDialog({ open: false, advance: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, advance: null });
  };

  return (
    <Box>
      {/* Search Input */}
      <TextField
        fullWidth
        size="small"
        placeholder={getText('Search by worker, amount, reason...', 'कर्मचारी, राशि, कारण से खोजें...')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery('')}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {sortedAdvances.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchQuery 
              ? getText('No matching advances found', 'कोई मिलान नहीं मिला')
              : getText('No advances recorded', 'कोई अग्रिम दर्ज नहीं है')
            }
          </Typography>
        </Box>
      ) : (
        <>
          {searchQuery && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {getText(`Found ${sortedAdvances.length} result${sortedAdvances.length !== 1 ? 's' : ''}`, `${sortedAdvances.length} परिणाम मिले`)}
            </Typography>
          )}
          <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{getText('Date', 'तारीख')}</TableCell>
                  {showWorkerName && (
                    <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{getText('Worker', 'कर्मचारी')}</TableCell>
                  )}
                  <TableCell align="right" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{getText('Amount', 'राशि')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{getText('Reason', 'कारण')}</TableCell>
                  <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{getText('Action', 'कार्रवाई')}</TableCell>
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
                        onClick={() => handleDeleteClick(advance)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{getText('Delete Advance', 'अग्रिम हटाएं')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getText(
              `Are you sure you want to delete this advance of ₹${deleteDialog.advance?.amount?.toLocaleString()}${deleteDialog.advance?.workerId && showWorkerName ? ` for ${getWorkerName(deleteDialog.advance.workerId)}` : ''}?`,
              `क्या आप वाकई ₹${deleteDialog.advance?.amount?.toLocaleString()}${deleteDialog.advance?.workerId && showWorkerName ? ` ${getWorkerName(deleteDialog.advance.workerId)} के लिए` : ''} का यह अग्रिम हटाना चाहते हैं?`
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

export default AdvanceList;
