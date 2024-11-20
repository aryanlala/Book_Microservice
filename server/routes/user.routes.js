const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Book = require('../models/book.model');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.user._id); // Debug log
    
    const user = await User.findById(req.user._id)
      .select('-password')
      .lean(); // Using lean() for better performance
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user); // Debug log
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's books
router.get('/my-books', auth, async (req, res) => {
  try {
    console.log('Fetching books for user ID:', req.user._id); // Debug log
    
    const books = await Book.find({ owner: req.user._id })
      .sort('-createdAt')
      .lean(); // Using lean() for better performance
    
    console.log(`Found ${books.length} books for user`); // Debug log
    res.json(books);
  } catch (error) {
    console.error('Books fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 