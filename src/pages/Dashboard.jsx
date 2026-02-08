import { Box, Typography } from '@mui/material';
import DashboardSummary from '../components/Reports/DashboardSummary';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const { getText } = useLanguage();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {getText('Dashboard', 'डैशबोर्ड')}
      </Typography>
      <DashboardSummary />
    </Box>
  );
};

export default Dashboard;
