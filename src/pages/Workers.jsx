import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import WorkerList from '../components/Workers/WorkerList';
import WorkerForm from '../components/Workers/WorkerForm';
import WorkerDetails from '../components/Workers/WorkerDetails';
import { useWorkers } from '../context/WorkerContext';

const Workers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addWorker, updateWorker, deleteWorker, getWorker } = useWorkers();
  const [formOpen, setFormOpen] = useState(false);
  const [editWorker, setEditWorker] = useState(null);
  const [detailsWorker, setDetailsWorker] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAdd = () => {
    setEditWorker(null);
    setFormOpen(true);
  };

  const handleEdit = (worker) => {
    setEditWorker(worker);
    setFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editWorker) {
      updateWorker(editWorker.id, data);
    } else {
      addWorker(data);
    }
    setFormOpen(false);
    setEditWorker(null);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const handleToggleStatus = (workerId) => {
    const worker = getWorker(workerId);
    if (worker) {
      updateWorker(workerId, {
        ...worker,
        status: worker.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteWorker(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <Box sx={{ pb: isMobile ? 8 : 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Workers / कर्मचारी
        </Typography>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Worker / जोड़ें
          </Button>
        )}
      </Box>

      <WorkerList
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Worker / कर्मचारी जोड़ें
          </Button>
        </Box>
      )}

      <WorkerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditWorker(null);
        }}
        onSubmit={handleFormSubmit}
        worker={editWorker}
      />

      <WorkerDetails
        open={!!detailsWorker}
        onClose={() => setDetailsWorker(null)}
        worker={detailsWorker}
      />

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete / हटाने की पुष्टि करें</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this worker?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            क्या आप वाकई इस कर्मचारी को हटाना चाहते हैं?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>
            Cancel / रद्द करें
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete / हटाएं
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workers;
