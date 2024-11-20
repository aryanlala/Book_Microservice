import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  IconButton,
  InputAdornment,
  Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';

const genres = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Science Fiction',
  'Romance',
  'Biography',
  'History',
  'Fantasy',
  'Horror'
];

const locations = [
  'All',
  'Bangalore',
  'Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Kolhapur',
  'Ghaziabad',
  'Noida',
  'Gurugram',
  'Chandigarh',
  'Jaipur',
  'Lucknow'
];

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [booksPerPage] = useState(9); // Number of books per page
  const [totalBooks, setTotalBooks] = useState(0); // Add this state
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedGenre, selectedLocation, availability, page]);

  const fetchBooks = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let url = 'http://localhost:8080/api/books';
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (selectedLocation && selectedLocation !== 'All') {
        params.append('location', selectedLocation);
      }
      if (availability !== 'all') params.append('availability', availability);
      
      params.append('page', page);
      params.append('limit', booksPerPage);

      const response = await axios.get(`${url}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Safely set the data
      setBooks(response.data.books || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalBooks(response.data.totalBooks || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError(error.response?.data?.message || 'Failed to fetch books');
      // Set empty data on error
      setBooks([]);
      setTotalPages(1);
      setTotalBooks(0);
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(event.target.value);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    // Optional: If you want to reset other filters when location changes
    // setSearchQuery('');
    // setSelectedGenre('All');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header with Add Book button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Book Exchange
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => navigate('/add-book')}
        >
          Add New Book
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Search Bar */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by title, author, or genre..."
              variant="outlined"
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Filters */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    label="Genre"
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    label="Location"
                  >
                    {locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    label="Availability"
                  >
                    <MenuItem value="all">All Books</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="unavailable">Not Available</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Results with page loading state */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box position="relative">
            {pageLoading && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.7)"
                zIndex={1}
              >
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {books && books.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                No books found matching your criteria
              </Alert>
            ) : (
              <>
                <Grid container spacing={3}>
                  {books && books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book._id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                            cursor: 'pointer'
                          }
                        }}
                        onClick={() => navigate(`/books/${book._id}`)}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            {book.title}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            by {book.author}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              Genre: {book.genre}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              Location: {book.location}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              Condition: {book.condition}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: book.isAvailable ? 'success.main' : 'error.main',
                                fontWeight: 'bold',
                                mt: 1
                              }}
                            >
                              {book.isAvailable ? '✓ Available' : '× Not Available'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Results count */}
                {books && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography color="textSecondary">
                      Showing {books.length} books of {totalBooks} total results
                    </Typography>
                  </Box>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 4,
                      mb: 4
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      disabled={pageLoading}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default BookList; 