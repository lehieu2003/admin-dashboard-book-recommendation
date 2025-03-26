import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Backdrop,
  CircularProgress,
  Avatar
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { userApi } from '../../api/userApi';

function Users() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [viewDialog, setViewDialog] = useState({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  // Get users
  const { data, isLoading } = useQuery({
    queryKey: ['users', filters, pagination.page, pagination.limit],
    queryFn: () => userApi.getUsers({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      role: filters.role,
      status: filters.status,
    }),
    keepPreviousData: true,
    onSuccess: (data) => {
      setPagination({ ...pagination, total: data.total });
    },
  });

  // Update user status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => userApi.updateUser(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteDialog({ open: false, userId: null });
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filter changes
  };

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

  const handleViewUser = (user) => {
    setViewDialog({ open: true, user });
  };

  const handleDeleteClick = (userId) => {
    setDeleteDialog({ open: true, userId });
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deleteDialog.userId);
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    statusMutation.mutate({ id: userId, status: newStatus });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          component="a"
          href="/users/add"
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
              placeholder="Search by name or email"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === 'admin' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    color={user.status === 'active' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewUser(user)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton component="a" href={`/users/edit/${user.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleToggleStatus(user.id, user.status)}>
                    {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(user.id)}>
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

      {/* View User Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, user: null })}
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewDialog.user && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar sx={{ width: 100, height: 100, fontSize: 40 }}>
                  {viewDialog.user.name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body1">{viewDialog.user.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body1">{viewDialog.user.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Role</Typography>
                <Typography variant="body1">{viewDialog.user.role}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Typography variant="body1">{viewDialog.user.status}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Joined Date</Typography>
                <Typography variant="body1">
                  {new Date(viewDialog.user.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Last Login</Typography>
                <Typography variant="body1">
                  {viewDialog.user.lastLogin
                    ? new Date(viewDialog.user.lastLogin).toLocaleString()
                    : 'Never'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, user: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleteMutation.isLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || statusMutation.isLoading || deleteMutation.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Users;