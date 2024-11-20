import { create } from 'zustand';

const useExchangeStore = create((set) => ({
  exchanges: [],
  loading: false,
  error: null,
  setExchanges: (exchanges) => set({ exchanges, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  addExchange: (exchange) => 
    set((state) => ({ 
      exchanges: [...state.exchanges, exchange],
      loading: false,
      error: null 
    })),
  updateExchange: (id, status) =>
    set((state) => ({
      exchanges: state.exchanges.map(ex => 
        ex.id === id ? { ...ex, status } : ex
      )
    })),
}));

export default useExchangeStore; 