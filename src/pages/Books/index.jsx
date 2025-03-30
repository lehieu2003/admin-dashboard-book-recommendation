import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
  Checkbox,
  Grid,
  Grid2
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { bookApi } from '../../api/bookApi';
import { categoryApi } from '../../api/categoryApi';
import { useBookStore } from '../../stores/bookStore';

function Books() {
  const { filters, pagination, setFilters, setPagination, setBooks } = useBookStore();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bookId: null });
  const [viewDialog, setViewDialog] = useState({ open: false, book: null });


  const [selectedBooks, setSelectedBooks] = useState([]);
  const [batchActionDialog, setBatchActionDialog] = useState({ open: false, action: null });
  

    // Hàm xử lý chọn nhiều sách
  const handleSelectBook = (bookId) => {
    setSelectedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  // Hàm xử lý xóa hàng loạt
  const handleBatchDelete = async () => {
    try {
      await bookApi.batchDeleteBooks(selectedBooks);
      setBatchActionDialog({ open: false, action: null });
      setSelectedBooks([]);
      await refetch(); // Ensure refetch completes before continuing
      
      // If all books were deleted from the current page, go back to page 1
      if (data?.books?.length === selectedBooks.length) {
        setPagination({
          ...pagination,
          page: 1
        });
        // Force a second refetch to load page 1 data
        setTimeout(() => {
          refetch();
        }, 100);
      }
    } catch (error) {
      console.error('Error batch deleting books:', error);
    }
  };

  // Hàm xử lý khôi phục sách đã xóa
  const handleRestore = async (bookId) => {
    try {
      await bookApi.restoreBook(bookId);
      refetch(); // Refetch dữ liệu sau khi khôi phục
    } catch (error) {
      console.error('Error restoring book:', error);
    }
  };


  // Get books with filters and pagination
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['books', filters, pagination.page, pagination.limit],
    queryFn: () => bookApi.getBooks({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      category: filters.category,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    keepPreviousData: true,
    onSuccess: (data) => {
      setBooks(data.books);
      setPagination({ ...pagination, total: data.total });
    },
  });

  // Get categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories({ limit: 100 }),
    keepPreviousData: true,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
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

  const handleViewBook = (book) => {
    setViewDialog({ open: true, book });
  };

  const handleDeleteClick = (bookId) => {
    setDeleteDialog({ open: true, bookId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookApi.deleteBook(deleteDialog.bookId);
      setDeleteDialog({ open: false, bookId: null });
      await refetch();
      
      if (data?.books?.length === selectedBooks.length) {
        setPagination({
          ...pagination,
          page: 1
        });
        // Force a second refetch to load page 1 data
        setTimeout(() => {
          refetch();
        }, 100);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, bookId: null });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Books</Typography>
        <Box>
          {selectedBooks.length > 0 && (
            <Button
              color="error"
              variant="contained"
              onClick={() => setBatchActionDialog({ open: true, action: 'delete' })}
              startIcon={<DeleteIcon />}
              sx={{ mr: 2 }}
            >
              Delete Selected ({selectedBooks.length})
            </Button>
          )}
          <Button
            component={Link}
            to="/books/add"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Book
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search books"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid2>
          <Grid2 item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categoriesData?.categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              label="Sort By"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="createdAt">Date Added</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </TextField>
          </Grid2>
          <Grid2 item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Order"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Grid2>
        </Grid2>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBooks(data?.books?.map(book => book.id) || []);
                    } else {
                      setSelectedBooks([]);
                    }
                  }}
                  checked={data?.books?.length > 0 && selectedBooks.length === data?.books?.length}
                  indeterminate={selectedBooks.length > 0 && selectedBooks.length < (data?.books?.length || 0)}
                />
              </TableCell>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.books?.map((book) => (
              <TableRow key={book.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar
                    alt={book.title}
                    src={book.coverImage}
                    sx={{ width: 50, height: 70, borderRadius: 1 }}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  {book.categories.map((category) => (
                    <Chip 
                      key={category.id} 
                      label={category.name} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </TableCell>
                <TableCell>{book.rating && typeof book.rating === 'number' ? book.rating.toFixed(1) : 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewBook(book)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton component={Link} to={`/books/edit/${book.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(book.id)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this book? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Batch Delete Confirmation Dialog */}
      <Dialog
        open={batchActionDialog.open && batchActionDialog.action === 'delete'}
        onClose={() => setBatchActionDialog({ open: false, action: null })}
      >
        <DialogTitle>Delete Books</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedBooks.length} selected books? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchActionDialog({ open: false, action: null })}>Cancel</Button>
          <Button onClick={handleBatchDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* View Book Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, book: null })}
        maxWidth="md"
      >
        <DialogTitle>{viewDialog.book?.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <img 
                src={viewDialog.book?.coverImage} 
                alt={viewDialog.book?.title}
                style={{ width: '100%', borderRadius: 8 }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1"><strong>Author:</strong> {viewDialog.book?.author}</Typography>
              <Typography variant="body1"><strong>ISBN:</strong> {viewDialog.book?.isbn}</Typography>
              <Typography variant="body1"><strong>Published:</strong> {viewDialog.book?.publishedDate}</Typography>
              <Typography variant="body1"><strong>Publisher:</strong> {viewDialog.book?.publisher}</Typography>
              <Typography variant="body1"><strong>Rating:</strong> {viewDialog.book?.rating && typeof viewDialog.book.rating === 'number' ? `${viewDialog.book.rating.toFixed(1)}/5` : 'N/A'}</Typography>
              <Typography variant="body1"><strong>Categories:</strong> {viewDialog.book?.categories.map(c => c.name).join(', ')}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}><strong>Description:</strong></Typography>
              <Typography variant="body2">{viewDialog.book?.description}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, book: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Books;