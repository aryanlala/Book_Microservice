import { create } from 'zustand';

const useBookStore = create((set) => ({
  books: [],
  loading: false,
  error: null,
  setBooks: (books) => set({ books, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));

export default useBookStore; 