const Book = require('../models/book.model');

exports.addBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      owner: req.user._id
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { search, genre } = req.query;
    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (genre) {
      query.genre = genre;
    }

    const books = await Book.find(query)
      .populate('owner', 'username')
      .sort('-createdAt');
      
    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');

    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { genre: searchRegex },
        { description: searchRegex }
      ]
    });

    res.json({
      results: books,
      count: books.length,
      query
    });
  } catch (error) {
    res.status(500).json({ message: 'Error performing search', error: error.message });
  }
}; 