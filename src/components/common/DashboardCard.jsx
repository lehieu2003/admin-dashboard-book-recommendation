import { Paper, Box, Typography } from '@mui/material';

function DashboardCard({ title, value, icon, color }) {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        height: '100%',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            backgroundColor: `${color}20`, 
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default DashboardCard;