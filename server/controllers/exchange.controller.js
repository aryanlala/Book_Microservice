const Exchange = require('../models/exchange.model');
const Book = require('../models/book.model');

exports.createExchange = async (req, res) => {
  try {
    const book = await Book.findById(req.body.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const exchange = await Exchange.create({
      requester: req.user._id,
      owner: book.owner,
      book: book._id,
      message: req.body.message
    });

    await exchange.populate(['requester', 'owner', 'book']);
    res.status(201).json(exchange);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateExchangeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const exchange = await Exchange.findById(id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    
    if (exchange.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    exchange.status = status;
    if (status === 'accepted') {
      await Book.findByIdAndUpdate(exchange.book, { isAvailable: false });
    }
    
    await exchange.save();
    await exchange.populate(['requester', 'owner', 'book']);
    
    res.json(exchange);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 