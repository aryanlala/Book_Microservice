import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navbar';
import Register from './components/RegisterForm';

// import Register from './pages/RegisterForm';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import Login from './pages/Login';
import ExchangeManagement from './components/ExchangeManagement';
import ActiveExchanges from './pages/ActiveExchanges';
import CompletedExchanges from './pages/CompletedExchanges';
import BookDetail from './pages/BookDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import ExchangeData from './pages/ExchangeData';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route 
            path="/" 
            element={
              <Navigate to="/books" replace />
            } 
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/books" 
            element={
              <ProtectedRoute>
                <BookList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-book" 
            element={
              <ProtectedRoute>
                <AddBook />
              </ProtectedRoute>
            } 
          />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/exchanges" element={<ExchangeManagement />} />
          <Route path="/active-exchanges" element={<ActiveExchanges />} />
          <Route path="/completed-exchanges" element={<CompletedExchanges />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exchanges" element={<ExchangeData />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 