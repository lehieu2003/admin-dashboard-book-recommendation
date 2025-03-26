// src/pages/FileManager/index.js
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadApi } from '../../api/uploadApi';

function FileManager() {
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, filename: null });
  
  const { data, isLoading, error } = useQuery(
    ['uploadedFiles'],
    () => uploadApi.getUploadedFiles()
  );
  
  const deleteMutation = useMutation(
    (filename) => uploadApi.deleteUploadedFile(filename),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['uploadedFiles']);
        setDeleteDialog({ open: false, filename: null });
      }
    }
  );
  
  const handleDeleteClick = (filename) => {
    setDeleteDialog({ open: true, filename });
  };
  
  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deleteDialog.filename);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading files: {error.message}
      </Alert>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>File Manager</Typography>
      
      <Grid container spacing={3}>
        {data?.files?.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.name}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={file.url}
                alt={file.name}
              />
              <CardContent>
                <Typography variant="body2" noWrap title={file.name}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(file.name)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {data?.files?.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No files uploaded yet
          </Typography>
        </Box>
      )}
      
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, filename: null })}
      >
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this file? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, filename: null })}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FileManager;