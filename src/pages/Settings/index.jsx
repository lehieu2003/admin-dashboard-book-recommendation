// src/pages/Settings/index.js
import { Box, Typography, Paper, Switch, FormControlLabel, Divider } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Appearance</Typography>
        
        <FormControlLabel
          control={
            <Switch 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          }
          label="Dark Mode"
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Preferences</Typography>
        
        {/* Thêm các tùy chọn khác ở đây */}
      </Paper>
    </Box>
  );
}

export default Settings;