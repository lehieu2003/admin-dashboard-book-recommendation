import { Box, Typography, Paper, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import DashboardCard from '../../components/common/DashboardCard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { dashboardApi } from '../../api/dashboardApi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const { data: stats, isLoading } = useQuery({ 
    queryKey: ['dashboardStats'], 
    queryFn: () => dashboardApi.getDashboardStats() 
  });

  // Generate random colors for charts
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${Math.random() * 360}, 70%, 60%)`);
    }
    return colors;
  };

  const categoryData = {
    labels: stats?.topCategories?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Books per Category',
        data: stats?.topCategories?.map(item => item.count) || [],
        backgroundColor: generateColors(stats?.topCategories?.length || 0),
      },
    ],
  };

  const userActivityData = {
    labels: stats?.userActivity?.map(item => item.month) || [],
    datasets: [
      {
        label: 'New Users',
        data: stats?.userActivity?.map(item => item.newUsers) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Book Recommendations',
        data: stats?.userActivity?.map(item => item.recommendations) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
            title="Total Books" 
            value={stats?.totalBooks || 0} 
            icon={<LibraryBooksIcon />} 
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={<PeopleIcon />} 
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
            title="Categories" 
            value={stats?.totalCategories || 0} 
            icon={<CategoryIcon />} 
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
            title="Reviews" 
            value={stats?.totalReviews || 0} 
            icon={<RateReviewIcon />} 
            color="#9c27b0"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Top Categories</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>User Activity (Last 6 Months)</Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={userActivityData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;