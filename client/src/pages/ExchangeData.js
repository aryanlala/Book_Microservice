import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExchangeData = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/exchanges/user-exchanges', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExchanges(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      setError(error.response?.data?.message || 'Failed to fetch exchange data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Exchange History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {exchanges.length === 0 ? (
        <Alert severity="info">
          You haven't made any exchanges yet.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Title</TableCell>
                <TableCell>Exchange Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Other User</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exchanges.map((exchange) => (
                <TableRow key={exchange._id}>
                  <TableCell>{exchange.book.title}</TableCell>
                  <TableCell>
                    {exchange.type === 'request' ? 'Requested' : 'Received'}
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={
                        exchange.status === 'accepted'
                          ? 'success.main'
                          : exchange.status === 'pending'
                          ? 'warning.main'
                          : 'error.main'
                      }
                    >
                      {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {exchange.type === 'request'
                      ? exchange.owner.username
                      : exchange.requester.username}
                  </TableCell>
                  <TableCell>
                    {new Date(exchange.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ExchangeData; 