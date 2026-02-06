import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Person,
  Business,
  Phone,
  CalendarMonth,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { contractor, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: contractor?.firstName || '',
    lastName: contractor?.lastName || '',
    age: contractor?.age || '',
    companyName: contractor?.companyName || '',
    establishedYear: contractor?.establishedYear || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: contractor?.firstName || '',
      lastName: contractor?.lastName || '',
      age: contractor?.age || '',
      companyName: contractor?.companyName || '',
      establishedYear: contractor?.establishedYear || '',
    });
    setError('');
  };

  const handleSave = () => {
    setError('');
    setSuccess('');

    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      setError('Please enter a valid age (18-100)');
      return;
    }
    if (formData.establishedYear) {
      const year = parseInt(formData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        setError(`Established year must be between 1900 and ${currentYear}`);
        return;
      }
    }

    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: parseInt(formData.age),
      companyName: formData.companyName,
      establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
    });

    setIsEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const avatarLetter = contractor?.firstName?.[0]?.toUpperCase() || 'C';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile / प्रोफाइल
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {avatarLetter}
              </Avatar>
              <Typography variant="h5">
                {contractor?.firstName} {contractor?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +91 {contractor?.mobile}
              </Typography>
              {contractor?.companyName && (
                <Typography variant="body1" color="primary" sx={{ mt: 1 }}>
                  {contractor.companyName}
                </Typography>
              )}
              {contractor?.establishedYear && (
                <Typography variant="caption" color="text.secondary">
                  Since {contractor.establishedYear}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Personal Details / व्यक्तिगत विवरण
                </Typography>
                {!isEditing ? (
                  <Button startIcon={<Edit />} onClick={handleEdit}>
                    Edit / संपादित करें
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<Cancel />} onClick={handleCancel} color="inherit">
                      Cancel
                    </Button>
                    <Button startIcon={<Save />} onClick={handleSave} variant="contained">
                      Save
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name / पहला नाम *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name / उपनाम *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age / उम्र *"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    inputProps={{ min: 18, max: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile / मोबाइल"
                    value={contractor?.mobile || ''}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                          +91
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Company Details / कंपनी विवरण (Optional)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name / कंपनी का नाम"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Established Year / स्थापना वर्ष"
                    name="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., 1999"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth color="action" />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 1900, max: new Date().getFullYear() }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, opacity: 0.8 }}>
                <Typography variant="body2" color="info.contrastText">
                  Note: Mobile number cannot be changed. Contact support if you need to update it.
                </Typography>
                <Typography variant="caption" color="info.contrastText">
                  नोट: मोबाइल नंबर बदला नहीं जा सकता। अपडेट के लिए सहायता से संपर्क करें।
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* App Details Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                Kaamgar
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                कामगार - Contractor Management App
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                The complete solution for contractors and construction companies
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Kaamgar. All rights reserved.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Developed by Vishal Soni | Rajasthan, India
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Be kind to Animals. 🐾
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
