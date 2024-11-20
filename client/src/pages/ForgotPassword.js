import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email
      });
      
      // In a real app, the token would be sent via email
      // Here we're just storing it to demonstrate the flow
      setResetToken(response.data.resetToken);
      setMessage('Reset token generated successfully. Click the link below to reset your password.');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Request Reset'}
          </Button>
        </form>

        {resetToken && (
          <Box sx={{ mt: 2 }}>
            <Link 
              href={`/reset-password/${resetToken}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/reset-password/${resetToken}`);
              }}
            >
              Click here to reset your password
            </Link>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Link 
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 