import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { books } from '../services/api';
import { useNavigate } from 'react-router-dom';

const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Romance', 'Biography'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      const requiredFields = ['title', 'author', 'genre', 'condition', 'location'];
      const missingFields = requiredFields.filter(field => !bookData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const response = await books.addBook({
        ...bookData,
        isAvailable: true // Set default availability
      });

      console.log('Book added successfully:', response);
      navigate('/books'); // Redirect to books list
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.response?.data?.message || error.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Add New Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="title"
              label="Book Title"
              value={bookData.title}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              required
              name="author"
              label="Author"
              value={bookData.author}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              required
              select
              name="genre"
              label="Genre"
              value={bookData.genre}
              onChange={handleChange}
              fullWidth
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              select
              name="condition"
              label="Condition"
              value={bookData.condition}
              onChange={handleChange}
              fullWidth
            >
              {conditions.map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              name="location"
              label="Location"
              value={bookData.location}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="description"
              label="Description"
              value={bookData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ height: '48px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Book'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddBook; 