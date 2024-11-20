const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exchangesRouter = require('./routes/exchanges');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use exchanges routes
app.use('/exchanges', exchangesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 