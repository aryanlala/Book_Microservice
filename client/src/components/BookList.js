import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Card, Button, InputGroup } from 'react-bootstrap';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    genre: '',
    availability: 'all',
    page: 1
  });
  const [genres, setGenres] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch available genres on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch books when search params change
  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/books/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/books/advanced-search', {
        ...searchParams,
        limit: 8 // books per page
      });
      
      setBooks(response.data.results);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <Container className="py-4">
      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <InputGroup>
              <Form.Control
                type="text"
                name="query"
                placeholder="Search by title or author..."
                value={searchParams.query}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Col>
          
          <Col md={3}>
            <Form.Select
              name="genre"
              value={searchParams.genre}
              onChange={handleInputChange}
            >
              <option value="">All Genres</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </Form.Select>
          </Col>
          
          <Col md={3}>
            <Form.Select
              name="availability"
              value={searchParams.availability}
              onChange={handleInputChange}
            >
              <option value="all">All Books</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </Form.Select>
          </Col>
          
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Results */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <Row className="g-4">
            {books.map((book) => (
              <Col key={book._id} md={3}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                      <p><strong>Author:</strong> {book.author}</p>
                      <p><strong>Genre:</strong> {book.genre}</p>
                      <p><strong>Condition:</strong> {book.condition}</p>
                      <p><strong>Status:</strong> 
                        {book.isAvailable ? 
                          <span className="text-success"> Available</span> : 
                          <span className="text-danger"> Not Available</span>
                        }
                      </p>
                    </Card.Text>
                    <Button 
                      variant="outline-primary" 
                      href={`/books/${book._id}`}
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page === 1}
                className="me-2"
              >
                Previous
              </Button>
              <span className="mx-3 align-self-center">
                Page {searchParams.page} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={searchParams.page === totalPages}
                className="ms-2"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default BookList; 