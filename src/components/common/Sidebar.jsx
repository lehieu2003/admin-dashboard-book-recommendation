import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BookIcon from '@mui/icons-material/Book';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const Sidebar = ({ open, drawerWidth }) => {
  const location = useLocation();
    const theme = useMuiTheme();

  const [booksOpen, setBooksOpen] = useState(location.pathname.startsWith('/books'));

  const handleBooksClick = () => {
    setBooksOpen(!booksOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      text: 'Books',
      icon: <LibraryBooksIcon />,
      subMenu: true,
      subMenuItems: [
        {
          text: 'All Books',
          icon: <BookIcon />,
          path: '/books'
        },
        {
          text: 'Add Book',
          icon: <AddBoxIcon />,
          path: '/books/add'
        }
      ]
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/users'
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/categories'
    },
    {
      text: 'Recommendation Settings',
      icon: <TuneIcon />,
      path: '/recommendation-settings'
    }
  ];

  
  const drawer = (
    <div>
      <Box 
        sx={{ 
          p: 2, 
          textAlign: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
        }}
      >
        <img 
          src="/logo.png" 
          alt="Book Recommendation Logo" 
          style={{ maxWidth: '100%', marginBottom: '10px' }} 
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Book Admin
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          item.subMenu ? (
            <Box key={item.text}>
              <ListItem disablePadding>
                <ListItemButton onClick={handleBooksClick}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {booksOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={booksOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subMenuItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      component={Link}
                      to={subItem.path}
                      selected={location.pathname === subItem.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
    </div>
  );

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;