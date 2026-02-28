import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
} from '@mui/material';
import { useWorkers } from '../../context/WorkerContext';
import { useAdvances } from '../../context/AdvanceContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTodayString } from '../../utils/dateUtils';

const AdvanceForm = ({ open, onClose, preSelectedWorker = null }) => {
  const { workers, getActiveWorkers } = useWorkers();
  const { addAdvance } = useAdvances();
  const { getText } = useLanguage();
  const activeWorkers = getActiveWorkers();

  const [formData, setFormData] = useState({
    workerId: preSelectedWorker || '',
    amount: '',
    reason: '',
    date: getTodayString(),
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.workerId) {
      setError(getText('Please select a worker', 'कर्मचारी चुनें'));
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError(getText('Please enter a valid amount', 'वैध राशि दर्ज करें'));
      return;
    }

    addAdvance(formData.workerId, formData.amount, formData.reason, formData.date);

    setFormData({
      workerId: preSelectedWorker || '',
      amount: '',
      reason: '',
      date: getTodayString(),
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      workerId: preSelectedWorker || '',
      amount: '',
      reason: '',
      date: getTodayString(),
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getText('Record Advance', 'अग्रिम दर्ज करें')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeWorkers.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {getText('No active workers available', 'कोई सक्रिय कर्मचारी उपलब्ध नहीं')}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }} disabled={activeWorkers.length === 0 || !!preSelectedWorker}>
            <InputLabel>{getText('Worker', 'कर्मचारी')} *</InputLabel>
            <Select
              name="workerId"
              value={formData.workerId}
              label={`${getText('Worker', 'कर्मचारी')} *`}
              onChange={handleChange}
              disabled={activeWorkers.length === 0 || !!preSelectedWorker}
            >
              {activeWorkers.map(w => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={`${getText('Amount', 'राशि')} *`}
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label={getText('Date', 'तारीख')}
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label={getText('Reason (Optional)', 'कारण (वैकल्पिक)')}
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            multiline
            rows={2}
            placeholder={getText('e.g., Medical emergency, Festival advance...', 'जैसे, चिकित्सा आपातकाल, त्योहार अग्रिम...')}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>{getText('Cancel', 'रद्द करें')}</Button>
          <Button type="submit" variant="contained" disabled={activeWorkers.length === 0}>
            {getText('Save', 'सेव करें')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdvanceForm;
