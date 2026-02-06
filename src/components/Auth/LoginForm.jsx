import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { Phone, Lock, Person, Business, CalendarMonth } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login, signup, checkMobileExists } = useAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('signup') ? 1 : 0); // 0 = Login, 1 = Signup
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login state
  const [loginMobile, setLoginMobile] = useState('');

  // Signup state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    mobile: '',
    companyName: '',
    establishedYear: '',
  });
  const [otp, setOtp] = useState('');

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setStep('form');
    setError('');
    setSuccess('');
    setOtp('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(loginMobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!checkMobileExists(loginMobile)) {
      setError('No account found with this mobile number. Please sign up first.');
      return;
    }

    const result = login(loginMobile);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const validateSignup = () => {
    if (!signupData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!signupData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!signupData.age || signupData.age < 18 || signupData.age > 100) {
      setError('Please enter a valid age (18-100)');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(signupData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (checkMobileExists(signupData.mobile)) {
      setError('An account already exists with this mobile number. Please login.');
      return false;
    }
    if (signupData.establishedYear) {
      const year = parseInt(signupData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        setError(`Established year must be between 1900 and ${currentYear}`);
        return false;
      }
    }
    return true;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateSignup()) return;

    setStep('otp');
    setSuccess('OTP sent to +91 ' + signupData.mobile);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(otp)) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    // For demo, accept any 4-digit OTP
    const result = signup({
      ...signupData,
      age: parseInt(signupData.age),
      establishedYear: signupData.establishedYear ? parseInt(signupData.establishedYear) : null,
    });

    if (!result.success) {
      setError('Signup failed. Please try again.');
    }
  };

  const handleBack = () => {
    setStep('form');
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Royal Construction
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Contractor Management / ठेकेदार प्रबंधन
          </Typography>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Login / लॉगिन" />
            <Tab label="Sign Up / पंजीकरण" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {tab === 0 && (
            <form onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Mobile Number / मोबाइल नंबर"
                value={loginMobile}
                onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                      <Typography sx={{ ml: 0.5 }}>+91</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
              >
                Login / लॉगिन करें
              </Button>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Don't have an account? Switch to Sign Up tab
              </Typography>
            </form>
          )}

          {tab === 1 && step === 'form' && (
            <form onSubmit={handleSignupSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name / पहला नाम *"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name / उपनाम *"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Age / उम्र *"
                    name="age"
                    type="number"
                    value={signupData.age}
                    onChange={handleSignupChange}
                    inputProps={{ min: 18, max: 100 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Mobile / मोबाइल *"
                    name="mobile"
                    value={signupData.mobile}
                    onChange={(e) => setSignupData(prev => ({
                      ...prev,
                      mobile: e.target.value.replace(/\D/g, '').slice(0, 10)
                    }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name / कंपनी का नाम (Optional)"
                    name="companyName"
                    value={signupData.companyName}
                    onChange={handleSignupChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Established Year / स्थापना वर्ष (Optional)"
                    name="establishedYear"
                    type="number"
                    value={signupData.establishedYear}
                    onChange={handleSignupChange}
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
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
              >
                Get OTP / OTP प्राप्त करें
              </Button>
            </form>
          )}

          {tab === 1 && step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                OTP sent to +91 {signupData.mobile}
              </Typography>
              <TextField
                fullWidth
                label="Enter OTP / OTP दर्ज करें"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="1234"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                Demo: Enter any 4 digits / डेमो: कोई भी 4 अंक दर्ज करें
              </Typography>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mb: 1 }}
              >
                Verify & Sign Up / सत्यापित करें
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={handleBack}
              >
                Back / वापस जाएं
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
