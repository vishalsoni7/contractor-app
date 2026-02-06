import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Alert,
  Box,
} from '@mui/material';
import { CurrencyRupee, Warning } from '@mui/icons-material';

const defaultWorker = {
  name: '',
  age: '',
  dailyWage: '',
  workStartTime: '09:00',
  workEndTime: '18:00',
};

const WorkerForm = ({ open, onClose, onSubmit, worker = null }) => {
  const [formData, setFormData] = useState(defaultWorker);
  const [errors, setErrors] = useState({});
  const [showChildLabourWarning, setShowChildLabourWarning] = useState(false);

  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name || '',
        age: worker.age || '',
        dailyWage: worker.dailyWage || '',
        workStartTime: worker.workStartTime || '09:00',
        workEndTime: worker.workEndTime || '18:00',
      });
    } else {
      setFormData(defaultWorker);
    }
    setErrors({});
    setShowChildLabourWarning(false);
  }, [worker, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check for child labour warning
    if (name === 'age') {
      const age = parseInt(value);
      setShowChildLabourWarning(age > 0 && age < 18);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.age || formData.age < 18 || formData.age > 70) {
      newErrors.age = 'Age must be between 18 and 70';
    }
    if (!formData.dailyWage || formData.dailyWage < 0) {
      newErrors.dailyWage = 'Valid daily wage is required';
    }
    if (!formData.workStartTime) {
      newErrors.workStartTime = 'Start time is required';
    }
    if (!formData.workEndTime) {
      newErrors.workEndTime = 'End time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        ...formData,
        age: parseInt(formData.age),
        dailyWage: parseFloat(formData.dailyWage),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {worker ? 'Edit Worker / कर्मचारी संपादित करें' : 'Add Worker / कर्मचारी जोड़ें'}
      </DialogTitle>
      <DialogContent>
        {showChildLabourWarning && (
          <Alert
            severity="error"
            icon={<Warning />}
            sx={{ mb: 2, mt: 1 }}
          >
            <Box>
              <strong>Child Labour Warning / बाल श्रम चेतावनी</strong>
            </Box>
            <Box sx={{ mt: 0.5 }}>
              Employing workers under 18 years of age is illegal under Child Labour laws.
            </Box>
            <Box sx={{ mt: 0.5, fontSize: '0.85rem' }}>
              18 वर्ष से कम आयु के श्रमिकों को नियुक्त करना बाल श्रम कानूनों के तहत अवैध है।
            </Box>
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: showChildLabourWarning ? 0 : 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name / नाम"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age / उम्र"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={!!errors.age || showChildLabourWarning}
              helperText={errors.age || (showChildLabourWarning ? 'Must be 18 or older' : '')}
              inputProps={{ min: 18, max: 70 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Daily Wage / दैनिक मजदूरी"
              name="dailyWage"
              type="number"
              value={formData.dailyWage}
              onChange={handleChange}
              error={!!errors.dailyWage}
              helperText={errors.dailyWage}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupee fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time / शुरू का समय"
              name="workStartTime"
              type="time"
              value={formData.workStartTime}
              onChange={handleChange}
              error={!!errors.workStartTime}
              helperText={errors.workStartTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time / समाप्ति समय"
              name="workEndTime"
              type="time"
              value={formData.workEndTime}
              onChange={handleChange}
              error={!!errors.workEndTime}
              helperText={errors.workEndTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel / रद्द करें</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {worker ? 'Update / अपडेट करें' : 'Add / जोड़ें'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerForm;
