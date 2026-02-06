import { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import WorkerCard from './WorkerCard';
import { useWorkers } from '../../context/WorkerContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getWorkerStats } from '../../utils/calculations';

const WorkerList = ({ onEdit, onDelete }) => {
  const { workers } = useWorkers();
  const { attendance } = useAttendance();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (workers.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No workers added yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          कोई कर्मचारी अभी तक नहीं जोड़ा गया
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search workers / कर्मचारी खोजें"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All / सभी</MenuItem>
            <MenuItem value="active">Active / सक्रिय</MenuItem>
            <MenuItem value="inactive">Inactive / निष्क्रिय</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredWorkers.map(worker => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={worker.id}>
            <WorkerCard
              worker={worker}
              onEdit={onEdit}
              onDelete={onDelete}
              stats={getWorkerStats(worker, attendance)}
            />
          </Grid>
        ))}
      </Grid>

      {filteredWorkers.length === 0 && workers.length > 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No workers match your search / आपकी खोज से कोई कर्मचारी मेल नहीं खाता
        </Typography>
      )}
    </Box>
  );
};

export default WorkerList;
