import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Auth/Login.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import Books from './pages/Books/index.jsx';
import AddBook from './pages/Books/AddBook.jsx';
import EditBook from './pages/Books/EditBook.jsx';
import Users from './pages/Users/index.jsx';
import Categories from './pages/Categories/index.jsx';
import RecommendationSettings from './pages/RecommendationSettings/index.jsx';
import { useAuthStore } from './stores/authStore.js';
import { useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      login({
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }, 'mock-token');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          
          <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/books/edit/:id" element={<EditBook />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/recommendation-settings" element={<RecommendationSettings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;