import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAdvances } from '../context/AdvanceContext';
import { useWorkers } from '../context/WorkerContext';
import AdvanceForm from '../components/Advances/AdvanceForm';
import AdvanceList from '../components/Advances/AdvanceList';
import { getCurrentMonth, getCurrentYear, getMonthName } from '../utils/dateUtils';

const Advances = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formOpen, setFormOpen] = useState(false);
  const { advances, getAdvancesForMonth } = useAdvances();
  const { workers } = useWorkers();

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const monthlyAdvances = getAdvancesForMonth(currentYear, currentMonth);

  const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
  const thisMonthTotal = monthlyAdvances.reduce((sum, a) => sum + a.amount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Advances / अग्रिम
        </Typography>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Record Advance / अग्रिम दर्ज करें
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="error.main">
                ₹{totalAdvances.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Advances / कुल अग्रिम
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="warning.main">
                ₹{thisMonthTotal.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getMonthName(currentMonth)} / इस महीने
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant={isMobile ? 'h5' : 'h4'} color="info.main">
                {advances.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Records / कुल रिकॉर्ड
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        All Advances / सभी अग्रिम
      </Typography>

      <AdvanceList />

      {isMobile && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setFormOpen(true)}
        >
          <Add />
        </Fab>
      )}

      <AdvanceForm open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
};

export default Advances;
