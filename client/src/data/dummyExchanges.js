export const dummyExchanges = [
  {
    _id: '1',
    book: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic Fiction',
    },
    requestedBy: {
      username: 'john_doe',
    },
    owner: {
      username: 'jane_smith',
    },
    status: 'pending',
    terms: {
      deliveryMethod: 'meetup',
      duration: 7,
      location: 'Central Park',
    },
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    book: {
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian Fiction',
    },
    requestedBy: {
      username: 'alice_wonder',
    },
    owner: {
      username: 'bob_builder',
    },
    status: 'accepted',
    terms: {
      deliveryMethod: 'shipping',
      duration: 14,
    },
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    book: {
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
    },
    requestedBy: {
      username: 'harry_potter',
    },
    owner: {
      username: 'hermione_granger',
    },
    status: 'completed',
    terms: {
      deliveryMethod: 'meetup',
      duration: 7,
      location: 'Hogwarts',
    },
    updatedAt: new Date().toISOString(),
  },
]; 