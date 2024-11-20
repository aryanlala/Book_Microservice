import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exchanges: [],
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {
    setExchanges: (state, action) => {
      state.exchanges = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setExchanges, setLoading, setError } = exchangeSlice.actions;
export default exchangeSlice.reducer; 