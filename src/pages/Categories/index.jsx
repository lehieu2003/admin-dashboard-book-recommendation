import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { categoryApi } from '../../api/categoryApi';

function Categories() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', data: { name: '', description: '' } });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, categoryId: null });
  const [errors, setErrors] = useState({});

  // Get categories
  const { data, isLoading } = useQuery({
    queryKey: ['categories', pagination.page, pagination.limit],
    queryFn: () => categoryApi.getCategories({
      page: pagination.page,
      limit: pagination.limit,
    }),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPagination({ ...pagination, total: data.total });
    },
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (categoryData) => categoryApi.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseFormDialog();
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseFormDialog();
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteDialog({ open: false, categoryId: null });
    }
  });

  const handleChangePage = (event, newPage) => {
    setPagination({ ...pagination, page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      ...pagination,
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const handleOpenFormDialog = (mode, category = null) => {
    if (mode === 'edit' && category) {
      setFormDialog({
        open: true,
        mode: 'edit',
        categoryId: category.id,
        data: {
          name: category.name,
          description: category.description || '',
        },
      });
    } else {
      setFormDialog({
        open: true,
        mode: 'add',
        categoryId: null,
        data: { name: '', description: '' },
      });
    }
    setErrors({});
  };

  const handleCloseFormDialog = () => {
    setFormDialog({ open: false, mode: 'add', categoryId: null, data: { name: '', description: '' } });
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDialog(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value }
    }));
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formDialog.data.name) newErrors.name = 'Category name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (formDialog.mode === 'add') {
      createMutation.mutate(formDialog.data);
    } else {
      updateMutation.mutate({ id: formDialog.categoryId, data: formDialog.data });
    }
  };

  const handleDeleteClick = (categoryId) => {
    setDeleteDialog({ open: true, categoryId });
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deleteDialog.categoryId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenFormDialog('add')}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Books Count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.booksCount || 0}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenFormDialog('edit', category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Category Form Dialog */}
      <Dialog open={formDialog.open} onClose={handleCloseFormDialog}>
        <DialogTitle>{formDialog.mode === 'add' ? 'Add New Category' : 'Edit Category'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Category Name"
              name="name"
              value={formDialog.data.name}
              onChange={handleFormChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              value={formDialog.data.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} disabled={createMutation.isLoading || updateMutation.isLoading}>
            {formDialog.mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, categoryId: null })}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This might affect books that belong to this category.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, categoryId: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleteMutation.isLoading}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Categories;