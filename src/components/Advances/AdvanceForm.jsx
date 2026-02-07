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
import { getTodayString } from '../../utils/dateUtils';

const AdvanceForm = ({ open, onClose, preSelectedWorker = null }) => {
  const { workers, getActiveWorkers } = useWorkers();
  const { addAdvance } = useAdvances();
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
      setError('Please select a worker / कर्मचारी चुनें');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount / वैध राशि दर्ज करें');
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
      <DialogTitle>Record Advance / अग्रिम दर्ज करें</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Worker / कर्मचारी *</InputLabel>
            <Select
              name="workerId"
              value={formData.workerId}
              label="Worker / कर्मचारी *"
              onChange={handleChange}
              disabled={!!preSelectedWorker}
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
            label="Amount / राशि *"
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
            label="Date / तारीख"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Reason / कारण (Optional)"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            multiline
            rows={2}
            placeholder="e.g., Medical emergency, Festival advance..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel / रद्द करें</Button>
          <Button type="submit" variant="contained">
            Save / सेव करें
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdvanceForm;
