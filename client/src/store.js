import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here
// import yourReducer from './features/yourSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here
    // yourFeature: yourReducer,
  },
});

export default store; 