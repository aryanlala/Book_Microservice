const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const Book = require('./models/book.model');
const Exchange = require('./models/exchange.model');
const User = require('./models/user.model');
const userRoutes = require('./routes/user.routes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
// Connect to MongoDB and initialize models
const initializeDB = async () => {
    try {
      await connectDB();
      console.log('MongoDB Connected Successfully');
      
      // Create collections if they don't exist
      await Promise.all([
        Book.createCollection(),
        Exchange.createCollection(),
        User.createCollection()
      ]);
      
      console.log('Database collections initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
      process.exit(1);
    }
  };
  
  // Initialize database
  initializeDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
// app.use('/api/exchanges', require('./routes/exchange.routes'));
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 