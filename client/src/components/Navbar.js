import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Book Exchange
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/books')}>
                Books
              </Button>
              <Button color="inherit" onClick={() => navigate('/add-book')}>
                Add Book
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>
                Profile
              </Button>
              <Button 
                color="inherit" 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 