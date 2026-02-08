import { Toaster } from 'react-hot-toast';
import { useTheme } from '@mui/material/styles';

const CustomToaster = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        // Prevent duplicate toasts
        id: undefined,
        style: {
          borderRadius: '8px',
          padding: '12px 16px',
          background: isDark ? theme.palette.grey[800] : '#fff',
          color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
          boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.5)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: theme.palette.success.main,
            secondary: isDark ? theme.palette.grey[800] : '#fff',
          },
          style: {
            background: isDark ? theme.palette.grey[800] : '#fff',
            color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: theme.palette.error.main,
            secondary: isDark ? theme.palette.grey[800] : '#fff',
          },
          style: {
            background: isDark ? theme.palette.grey[800] : '#fff',
            color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
          },
        },
        loading: {
          style: {
            background: isDark ? theme.palette.grey[800] : '#fff',
            color: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
          },
        },
      }}
    />
  );
};

export default CustomToaster;
