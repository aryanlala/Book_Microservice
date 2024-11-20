import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate email format
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      console.log('Attempting login with email:', formData.email);

      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email.toLowerCase(), // Ensure email is lowercase
        password: formData.password
      });

      console.log('Login response:', response.data);

      if (response.data && response.data.token) {
        // Store the token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Add a small delay before navigation
        setTimeout(() => {
          navigate('/books', { replace: true });
        }, 100);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data || error);
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              email: e.target.value.trim() // Remove whitespace
            }))}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              password: e.target.value
            }))}
            required
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              sx={{ textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
            <Link
              component={RouterLink}
              to="/register"
              sx={{ textDecoration: 'none' }}
            >
              Don't have an account? Register
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login; 