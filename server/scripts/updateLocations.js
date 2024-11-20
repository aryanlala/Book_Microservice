const mongoose = require('mongoose');
const Book = require('../models/book.model');

const locations = [
  'Bangalore',
  'Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Kolhapur',
  'Ghaziabad'
];

const updateLocations = async () => {
  try {
    await mongoose.connect('your_mongodb_connection_string');
    
    const books = await Book.find({ location: { $exists: false } });
    
    for (const book of books) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      await Book.findByIdAndUpdate(book._id, { 
        location: randomLocation 
      });
      console.log(`Updated book: ${book.title} with location: ${randomLocation}`);
    }
    
    console.log('All books updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating books:', error);
    process.exit(1);
  }
};

updateLocations(); 