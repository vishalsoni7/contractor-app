import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Person, Assessment } from '@mui/icons-material';
import WorkerReport from '../components/Reports/WorkerReport';
import MonthlyReport from '../components/Reports/MonthlyReport';

const Reports = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports / रिपोर्ट
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          variant="fullWidth"
        >
          <Tab
            icon={<Person />}
            label="Worker Report / कर्मचारी"
            iconPosition="start"
          />
          <Tab
            icon={<Assessment />}
            label="Monthly Summary / मासिक"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {tab === 0 && <WorkerReport />}
      {tab === 1 && <MonthlyReport />}
    </Box>
  );
};

export default Reports;
