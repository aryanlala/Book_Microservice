import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { books } from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      const response = await books.getById(id);
      setBook(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/books')} sx={{ mb: 2 }}>
        Back to Books
      </Button>
      
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                by {book.author}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Genre:</strong> {book.genre}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Condition:</strong> {book.condition}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Location:</strong> {book.location}
              </Typography>
              <Typography 
                variant="body1" 
                color={book.isAvailable ? "success.main" : "error.main"}
                gutterBottom
              >
                <strong>Status:</strong> {book.isAvailable ? 'Available' : 'Not Available'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">
                {book.description}
              </Typography>
            </Grid>
          </Grid>
          
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!book.isAvailable}
              onClick={() => handleExchangeRequest(book.id)}
            >
              {book.isAvailable ? 'Request Exchange' : 'Not Available'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookDetail; 