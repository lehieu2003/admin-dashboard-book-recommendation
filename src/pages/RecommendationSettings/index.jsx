import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Slider,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { recommendationApi } from '../../api/recommendationApi';

function RecommendationSettings() {
  const [settings, setSettings] = useState({
    algorithmType: 'collaborative',
    similarityThreshold: 0.5,
    maxRecommendations: 10,
    includeRatings: true,
    includeGenres: true,
    includePopularity: true,
    recencyWeight: 0.3,
    popularityWeight: 0.3,
    ratingWeight: 0.4,
    refreshInterval: 24,
  });

  const [success, setSuccess] = useState(false);

  // Get current settings
  // eslint-disable-next-line no-unused-vars
  const { data, isLoading } = useQuery({
    queryKey: ['recommendationSettings'],
    queryFn: async () => {
      const response = await recommendationApi.getRecommendationSettings();
      return response;
    },
    onSuccess: (data) => {
      setSettings(data);
    },
  });

  // Update settings mutation
  const { mutate, isLoading: isUpdating, error } = useMutation({
    mutationFn: async (updatedSettings) => {
      const response = await recommendationApi.updateRecommendationSettings(updatedSettings);
      return response;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSliderChange = (name) => (event, value) => {
    setSettings({ ...settings, [name]: value });
  };

  const handleSwitchChange = (name) => (event) => {
    setSettings({ ...settings, [name]: event.target.checked });
  };

  const handleNumberChange = (name) => (event) => {
    setSettings({ ...settings, [name]: parseInt(event.target.value, 10) });
  };

  const handleSelectChange = (event) => {
    setSettings({ ...settings, algorithmType: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(settings);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Recommendation Settings</Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.response?.data?.message || 'An error occurred while updating settings.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Algorithm Settings</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Algorithm Type</InputLabel>
                <Select
                  value={settings.algorithmType}
                  label="Algorithm Type"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="collaborative">Collaborative Filtering</MenuItem>
                  <MenuItem value="content">Content-Based</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Max Recommendations Per User</Typography>
              <TextField
                type="number"
                value={settings.maxRecommendations}
                onChange={handleNumberChange('maxRecommendations')}
                inputProps={{ min: 1, max: 50 }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Weighting Factors</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Recency Weight: {settings.recencyWeight}</Typography>
              <Slider
                value={settings.recencyWeight}
                onChange={handleSliderChange('recencyWeight')}
                min={0}
                max={1}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Popularity Weight: {settings.popularityWeight}</Typography>
              <Slider
                value={settings.popularityWeight}
                onChange={handleSliderChange('popularityWeight')}
                min={0}
                max={1}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Rating Weight: {settings.ratingWeight}</Typography>
              <Slider
                value={settings.ratingWeight}
                onChange={handleSliderChange('ratingWeight')}
                min={0}
                max={1}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Similarity Threshold: {settings.similarityThreshold}</Typography>
              <Slider
                value={settings.similarityThreshold}
                onChange={handleSliderChange('similarityThreshold')}
                min={0}
                max={1}
                step={0.05}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Features</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.includeRatings} 
                    onChange={handleSwitchChange('includeRatings')} 
                  />
                }
                label="Include Ratings"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.includeGenres} 
                    onChange={handleSwitchChange('includeGenres')} 
                  />
                }
                label="Include Genres"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.includePopularity} 
                    onChange={handleSwitchChange('includePopularity')} 
                  />
                }
                label="Include Popularity"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">System Settings</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Refresh Interval (hours)</Typography>
              <TextField
                type="number"
                value={settings.refreshInterval}
                onChange={handleNumberChange('refreshInterval')}
                inputProps={{ min: 1, max: 72 }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                type="submit" 
                disabled={isUpdating}
                sx={{ minWidth: 150 }}
              >
                {isUpdating ? <CircularProgress size={24} /> : 'Save Settings'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default RecommendationSettings;