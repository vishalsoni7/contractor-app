import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
} from '@mui/material';
import {
  Language,
  Check,
} from '@mui/icons-material';
import { useLanguage, LANGUAGE_MODES } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    handleClose();
  };

  const getCurrentLabel = () => {
    switch (language) {
      case LANGUAGE_MODES.ENGLISH:
        return 'EN';
      case LANGUAGE_MODES.HINDI:
        return 'हि';
      case LANGUAGE_MODES.BILINGUAL:
        return 'EN/हि';
      default:
        return 'EN/हि';
    }
  };

  const languageOptions = [
    { mode: LANGUAGE_MODES.ENGLISH, label: 'English' },
    { mode: LANGUAGE_MODES.HINDI, label: 'हिन्दी (Hindi)' },
    { mode: LANGUAGE_MODES.BILINGUAL, label: 'Both / दोनों' },
  ];

  return (
    <>
      <Tooltip title="Change Language / भाषा बदलें">
        <IconButton color="inherit" onClick={handleOpen}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Language />
            <Box sx={{ fontSize: '0.75rem', fontWeight: 'bold', minWidth: '32px' }}>
              {getCurrentLabel()}
            </Box>
          </Box>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {languageOptions.map(({ mode, label }) => (
          <MenuItem key={mode} onClick={() => handleLanguageChange(mode)}>
            <ListItemIcon>
              {language === mode && <Check fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
