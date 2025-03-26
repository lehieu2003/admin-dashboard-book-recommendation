import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  FormHelperText,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
import { bookApi } from '../../api/bookApi';
import { categoryApi } from '../../api/categoryApi';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    publisher: '',
    publishedDate: '',
    categories: [],
    coverImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Get book data
  // eslint-disable-next-line no-unused-vars
  const { data: bookDetails, isLoading: isLoadingBook } = useQuery(
    ['book', id],
    () => bookApi.getBook(id),
    {
      onSuccess: (data) => {
        const bookForEdit = {
          title: data.title,
          author: data.author,
          isbn: data.isbn || '',
          description: data.description,
          publisher: data.publisher || '',
          publishedDate: data.publishedDate ? data.publishedDate.split('T')[0] : '',
          categories: data.categories.map(c => c.id),
        };
        setBookData(bookForEdit);
        setPreviewImage(data.coverImage);
      },
      onError: (error) => {
        console.error('Error fetching book details:', error);
        navigate('/books');
      }
    }
  );

  // Get categories
  const { data: categoriesData } = useQuery(
    ['categories'],
    () => categoryApi.getCategories({ limit: 100 }),
    { keepPreviousData: true }
  );

  // Update book mutation
  const { mutate, isLoading: isUpdating, error } = useMutation(
    (data) => bookApi.updateBook(id, data),
    {
      onSuccess: () => {
        navigate('/books');
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      }
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setBookData(prev => ({
      ...prev,
      categories: typeof value === 'string' ? value.split(',') : value,
    }));
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData(prev => ({ ...prev, coverImage: file }));
      setPreviewImage(URL.createObjectURL(file));
      if (errors.coverImage) {
        setErrors(prev => ({ ...prev, coverImage: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookData.title) newErrors.title = 'Title is required';
    if (!bookData.author) newErrors.author = 'Author is required';
    if (!bookData.description) newErrors.description = 'Description is required';
    if (bookData.categories.length === 0) newErrors.categories = 'At least one category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(bookData);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Edit Book</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.response?.data?.message || 'An error occurred while updating the book.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                error={!!errors.author}
                helperText={errors.author}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={bookData.isbn}
                onChange={handleChange}
                error={!!errors.isbn}
                helperText={errors.isbn}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Publisher"
                name="publisher"
                value={bookData.publisher}
                onChange={handleChange}
                error={!!errors.publisher}
                helperText={errors.publisher}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Published Date"
                name="publishedDate"
                type="date"
                value={bookData.publishedDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.publishedDate}
                helperText={errors.publishedDate}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.categories}>
                <InputLabel id="categories-label">Categories</InputLabel>
                <Select
                  labelId="categories-label"
                  multiple
                  value={bookData.categories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categoriesData?.categories?.find(c => c.id === value);
                        return <Chip key={value} label={category?.name} />;
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {categoriesData?.categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categories && <FormHelperText>{errors.categories}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={bookData.description}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: 56 }}
              >
                Change Cover Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {errors.coverImage && (
                <FormHelperText error>{errors.coverImage}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {previewImage && (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={previewImage}
                    alt="Cover preview"
                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/books')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isUpdating}>
                  Update Book
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingBook || isUpdating}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default EditBook;