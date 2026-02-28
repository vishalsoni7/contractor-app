import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { getCurrentYear } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

const HolidayForm = ({ open, onClose, onSubmit }) => {
  const { getText } = useLanguage();
  const [formData, setFormData] = useState({
    date: '',
    name: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Holiday name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const year = new Date(formData.date).getFullYear();
      onSubmit({
        ...formData,
        year,
      });
      setFormData({ date: '', name: '' });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ date: '', name: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getText('Add Holiday', 'छुट्टी जोड़ें')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={getText('Date', 'तारीख')}
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={getText('Holiday Name', 'छुट्टी का नाम')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              placeholder={getText('e.g., Diwali, Republic Day', 'जैसे, दिवाली, गणतंत्र दिवस')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{getText('Cancel', 'रद्द करें')}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {getText('Add', 'जोड़ें')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HolidayForm;
