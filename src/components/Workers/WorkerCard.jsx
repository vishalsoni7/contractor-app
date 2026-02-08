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
  AccountBalanceWallet,
} from '@mui/icons-material';
import { formatTimeRange } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

const WorkerCard = ({ worker, onEdit, onDelete, onToggleStatus, stats, totalAdvances = 0 }) => {
  const { getText } = useLanguage();
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, overflow: 'hidden' }}>
            {worker.photo ? (
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
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
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', flexShrink: 0 }}>
                <Person />
              </Avatar>
            )}
            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Tooltip title={worker.name.length > 15 ? worker.name : ''} placement="top">
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {worker.name}
                </Typography>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {worker.age} {getText('years', 'वर्ष')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <Tooltip title={getText('Edit', 'संपादित करें')}>
              <IconButton size="small" onClick={() => onEdit(worker)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={getText('Delete', 'हटाएं')}>
              <IconButton size="small" color="error" onClick={() => onDelete(worker.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={getText('Click to toggle status', 'स्थिति बदलने के लिए क्लिक करें')}>
              <Chip
                label={worker.status === 'active' ? getText('Active', 'सक्रिय') : getText('Inactive', 'निष्क्रिय')}
                color={worker.status === 'active' ? 'success' : 'default'}
                size="small"
                onClick={() => onToggleStatus && onToggleStatus(worker.id)}
                sx={{ cursor: 'pointer', ml: 0.5 }}
              />
            </Tooltip>
          </Box>
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
                {getText('Present', 'उपस्थित')}: {stats.present} {getText('days', 'दिन')} | {getText('Earned', 'अर्जित')}: ₹{stats.totalEarnings.toFixed(2)}
              </Typography>
              {totalAdvances > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <AccountBalanceWallet fontSize="small" sx={{ color: 'error.main' }} />
                  <Typography variant="body2" color="error.main" fontWeight="600">
                    {getText('Advances', 'अग्रिम')}: ₹{totalAdvances.toLocaleString()}
                  </Typography>
                </Box>
              )}
              {stats.totalEarnings > 0 && (
                <Typography variant="body2" color="primary.main" fontWeight="600" sx={{ mt: 0.5 }}>
                  {getText('Net Pay', 'शुद्ध वेतन')}: ₹{(stats.totalEarnings - totalAdvances).toFixed(2)}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;
