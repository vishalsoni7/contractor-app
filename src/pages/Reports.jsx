import { Box, Typography } from '@mui/material';
import WorkerReport from '../components/Reports/WorkerReport';
import { useLanguage } from '../context/LanguageContext';

const Reports = () => {
  const { getText } = useLanguage();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {getText('Worker Report', 'कर्मचारी रिपोर्ट')}
      </Typography>

      <WorkerReport />
    </Box>
  );
};

export default Reports;
