const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  terms: {
    deliveryMethod: {
      type: String,
      enum: ['meetup', 'shipping'],
      required: true
    },
    duration: {
      type: Number, // in days
      required: true
    },
    location: String,
    additionalNotes: String
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

exchangeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Exchange = mongoose.model('Exchange', exchangeSchema);
module.exports = Exchange; 