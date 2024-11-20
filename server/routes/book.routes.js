const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const bookController = require('../controllers/book.controller');

// Protect all book routes with auth middleware
router.use(auth);

// Get all books with search and filters
router.get('/', auth, async (req, res) => {
  try {
    const { search, genre, availability, location, page = 1, limit = 9 } = req.query;
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Add genre filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Add location filter
    if (location && location !== 'All') {
      query.location = location;
    }

    // Add availability filter
    if (availability === 'available') {
      query.isAvailable = true;
    } else if (availability === 'unavailable') {
      query.isAvailable = false;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Book.countDocuments(query);

    // Get paginated results
    const books = await Book.find(query)
      .populate('owner', 'username')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    // Send response with pagination data
    res.json({
      books,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalBooks: total
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all unique genres (specific route before parameter routes)
router.get('/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular/trending genres
router.get('/trending-genres', async (req, res) => {
  try {
    const genres = await Book.aggregate([
      { $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get books by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const genreRegex = new RegExp(genre, 'i');
    
    const books = await Book.find({ 
      genre: genreRegex,
      isAvailable: true 
    }).populate('owner', 'username');

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Advanced search endpoint
router.post('/advanced-search', async (req, res) => {
  try {
    const {
      query,
      genre,
      location,
      availability,
      page = 1,
      limit = 9
    } = req.body;

    console.log('Received search params:', req.body);

    const filter = {};

    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { title: searchRegex },
        { author: searchRegex }
      ];
    }

    if (genre && genre !== 'All') {
      filter.genre = genre;
    }

    if (location && location !== 'All') {
      filter.location = location;
    }

    if (availability && availability !== 'all') {
      filter.isAvailable = availability === 'available';
    }

    console.log('Applied filters:', filter);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with filters and pagination
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('owner', 'username');

    // Get total count for pagination
    const total = await Book.countDocuments(filter);

    const response = {
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalBooks: total
    };

    console.log('Sending response:', response);

    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new book (protected route)
router.post('/', auth, async (req, res) => {
  try {
    // If location is not provided, set a default
    const bookData = {
      ...req.body,
      owner: req.user._id,
      location: req.body.location || 'Bangalore' // Default location if none provided
    };

    const book = new Book(bookData);
    const newBook = await book.save();
    
    // Add book to user's books array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { books: newBook._id } }
    );

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific book (must be after all other specific routes)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'username email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a book (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    // Check if book exists
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user owns the book
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this book' });
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a book (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    // Check if book exists
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user owns the book
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Remove book from user's books array first
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { books: req.params.id } }
    );

    // Delete the book using findByIdAndDelete
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error); // Add error logging
    res.status(500).json({ message: error.message });
  }
});

// Add this to your existing routes
router.get('/search', bookController.searchBooks);

module.exports = router; 