const express = require('express');
const router = express.Router();
const Exchange = require('../models/exchange.model');
const Book = require('../models/book.model');
const auth = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');

// Get user's exchanges (both as requester and owner)
router.get('/my-exchanges', auth, async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { requestedBy: req.user.id },
        { owner: req.user.id }
      ]
    })
    .populate('book')
    .populate('requestedBy', 'username email')
    .populate('owner', 'username email')
    .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create exchange request
router.post('/request/:bookId', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available for exchange' });
    }

    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot request your own book' });
    }

    const exchange = new Exchange({
      book: book._id,
      requestedBy: req.user.id,
      owner: book.owner,
      terms: req.body.terms
    });

    await exchange.save();

    // Send notification to book owner
    await sendNotification(book.owner, {
      type: 'new_exchange_request',
      message: `You have a new exchange request for "${book.title}"`,
      exchangeId: exchange._id
    });

    res.status(201).json(exchange);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update exchange status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('book')
      .populate('requestedBy', 'username email');

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // Verify user is involved in the exchange
    if (![exchange.owner.toString(), exchange.requestedBy.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    exchange.status = status;

    if (status === 'accepted') {
      exchange.startDate = new Date();
      exchange.endDate = new Date(Date.now() + (exchange.terms.duration * 24 * 60 * 60 * 1000));
      exchange.book.isAvailable = false;
      await exchange.book.save();
    }

    await exchange.save();

    // Send notification to other party
    const notifyUserId = req.user.id === exchange.owner.toString() 
      ? exchange.requestedBy._id 
      : exchange.owner;

    await sendNotification(notifyUserId, {
      type: `exchange_${status}`,
      message: `Your exchange request for "${exchange.book.title}" has been ${status}`,
      exchangeId: exchange._id
    });

    res.json(exchange);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add message to exchange
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    if (![exchange.owner.toString(), exchange.requestedBy.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    exchange.messages.push({
      sender: req.user.id,
      content: req.body.content
    });

    await exchange.save();
    res.json(exchange);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
 