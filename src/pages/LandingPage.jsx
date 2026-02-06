import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  People,
  CalendarMonth,
  Assessment,
  EventNote,
  Speed,
  Security,
} from '@mui/icons-material';

const features = [
  {
    icon: <People sx={{ fontSize: 40 }} />,
    title: 'Worker Management',
    titleHi: 'श्रमिक प्रबंधन',
    description: 'Add, track and manage all your workers in one place',
  },
  {
    icon: <CalendarMonth sx={{ fontSize: 40 }} />,
    title: 'Attendance Tracking',
    titleHi: 'उपस्थिति ट्रैकिंग',
    description: 'Mark daily attendance with full day, half day options',
  },
  {
    icon: <Assessment sx={{ fontSize: 40 }} />,
    title: 'Reports & Analytics',
    titleHi: 'रिपोर्ट और विश्लेषण',
    description: 'Generate detailed reports for payroll and performance',
  },
  {
    icon: <EventNote sx={{ fontSize: 40 }} />,
    title: 'Holiday Management',
    titleHi: 'छुट्टी प्रबंधन',
    description: 'Manage holidays and leaves efficiently',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
              >
                Contractor Management
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 2, opacity: 0.9, fontSize: { xs: '1.2rem', md: '1.5rem' } }}
              >
                ठेकेदार प्रबंधन ऐप
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.85, fontWeight: 'normal', lineHeight: 1.6 }}
              >
                The complete solution for contractors and construction companies to manage workers,
                track attendance, and generate reports effortlessly.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Login / लॉगिन
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login?signup=true')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Sign Up / पंजीकरण
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/fevicon.png"
                  alt="Contractors and Workers"
                  sx={{
                    width: { xs: 200, sm: 280, md: 350 },
                    height: 'auto',
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                    borderRadius: 4,
                    backgroundColor: 'white',
                    p: 3,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Who is this for Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Who is this for?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 5 }}
          >
            यह किसके लिए है?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Speed sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Contractors / ठेकेदार
                  </Typography>
                  <Typography color="text.secondary">
                    Manage your team efficiently and track daily work progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'warning.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Security sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Construction Companies
                  </Typography>
                  <Typography color="text.secondary">
                    निर्माण कंपनियां - Streamline workforce management across projects
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Features / विशेषताएं
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}
          >
            Everything you need to manage your construction workforce effectively
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                      {feature.titleHi}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            शुरू करने के लिए तैयार हैं?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.85 }}>
            Join thousands of contractors who trust our platform for their daily workforce management
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Get Started Free / मुफ्त में शुरू करें
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Contractor Management App. All rights reserved.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Developed by Vishal Soni | Rajasthan, India
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Be kind to Animals. 🐾
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
