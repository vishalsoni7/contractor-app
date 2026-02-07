import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Edit,
  Delete,
  AccessTime,
  CurrencyRupee,
  Person,
  LocationOn,
} from '@mui/icons-material';
import { formatTimeRange } from '../../utils/dateUtils';

const WorkerCard = ({ worker, onEdit, onDelete, onToggleStatus, stats }) => {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {worker.photo ? (
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={worker.photo}
                  sx={{ width: 48, height: 48 }}
                />
                {worker.photoLocation && (
                  <LocationOn
                    sx={{
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      fontSize: 16,
                      color: 'success.main',
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </Box>
            ) : (
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                <Person />
              </Avatar>
            )}
            <Box>
              <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
                {worker.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {worker.age} years
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Click to toggle status / स्थिति बदलने के लिए क्लिक करें">
            <Chip
              label={worker.status === 'active' ? 'Active' : 'Inactive'}
              color={worker.status === 'active' ? 'success' : 'default'}
              size="small"
              onClick={() => onToggleStatus && onToggleStatus(worker.id)}
              sx={{ cursor: 'pointer' }}
            />
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CurrencyRupee fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              ₹{worker.dailyWage}/day
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
              <Typography variant="body2" color="success.main" fontWeight="600">
                Present: {stats.present} days | Earned: ₹{stats.totalEarnings.toFixed(2)}
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
