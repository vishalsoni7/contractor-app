import { Box, Typography } from '@mui/material';
import DashboardSummary from '../components/Reports/DashboardSummary';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard / डैशबोर्ड
      </Typography>
      <DashboardSummary />
    </Box>
  );
};

export default Dashboard;
