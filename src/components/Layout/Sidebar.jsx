import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  People,
  EventAvailable,
  CalendarMonth,
  Assessment,
  Brightness4,
  Brightness7,
  Person,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';

const menuItems = [
  { text: 'Dashboard / डैशबोर्ड', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Workers / कर्मचारी', icon: <People />, path: '/dashboard/workers' },
  { text: 'Attendance / हाज़िरी', icon: <EventAvailable />, path: '/dashboard/attendance' },
  { text: 'Holidays / छुट्टियां', icon: <CalendarMonth />, path: '/dashboard/holidays' },
  { text: 'Reports / रिपोर्ट', icon: <Assessment />, path: '/dashboard/reports' },
  { text: 'Profile / प्रोफाइल', icon: <Person />, path: '/dashboard/profile' },
];

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeMode();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold" textAlign="center">
          Kaamgar
        </Typography>
        <Typography variant="caption" color="text.secondary">
          कामगार - Contractor Management
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={toggleTheme}
          sx={{
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <ListItemIcon>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText
            primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            secondary={mode === 'dark' ? 'लाइट मोड' : 'डार्क मोड'}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
