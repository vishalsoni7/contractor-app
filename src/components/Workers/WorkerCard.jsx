import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  AccessTime,
  CurrencyRupee,
  Person,
} from '@mui/icons-material';
import { formatTimeRange } from '../../utils/dateUtils';

const WorkerCard = ({ worker, onEdit, onDelete, stats }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            <Typography variant="h6" component="div">
              {worker.name}
            </Typography>
          </Box>
          <Chip
            label={worker.status === 'active' ? 'Active' : 'Inactive'}
            color={worker.status === 'active' ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Age / उम्र: {worker.age} years
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CurrencyRupee fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {worker.dailyWage}/day
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatTimeRange(worker.workStartTime, worker.workEndTime)}
            </Typography>
          </Box>

          {stats && (
            <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="success.main">
                Present: {stats.present} days | Earned: ₹{stats.totalEarnings}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, pt: 0 }}>
        <Tooltip title="Edit / संपादित करें">
          <IconButton size="small" onClick={() => onEdit(worker)}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete / हटाएं">
          <IconButton size="small" color="error" onClick={() => onDelete(worker.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default WorkerCard;
