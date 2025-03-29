import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
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
import FileManager from './pages/FileManager/index.jsx';
import { useAuthStore } from './stores/authStore.js';
// import { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Settings from './pages/Settings/index.jsx';

function AppContent() {
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuthStore();

  // Tạo theme dựa trên dark mode
  // Trong App.js, điều chỉnh createTheme
const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#90caf9' : '#1976d2', // Màu xanh nhạt hơn trong dark mode
    },
    secondary: {
      main: darkMode ? '#f48fb1' : '#dc004e', // Màu hồng nhạt hơn trong dark mode
    },
    background: {
      default: darkMode ? '#121212' : '#f5f5f5',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
    },
    success: {
      main: darkMode ? '#81c784' : '#4caf50',
    },
    error: {
      main: darkMode ? '#f44336' : '#d32f2f',
    },
    warning: {
      main: darkMode ? '#ffb74d' : '#ff9800',
    },
    info: {
      main: darkMode ? '#64b5f6' : '#2196f3',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
  },
});

  return (
    <MuiThemeProvider theme={theme}>
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
            <Route path="/file-manager" element={<FileManager />} />
            <Route path="/settings" element={<Settings />} />

          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;