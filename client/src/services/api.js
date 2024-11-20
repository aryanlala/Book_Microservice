import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  }
};

export const books = {
  getAll: async (params) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/books`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  },

  requestExchange: async (bookId) => {
    try {
      const response = await axios.post(`${API_URL}/books/${bookId}/exchange-request`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addBook: async (bookData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export const exchanges = {
  getAll: () => api.get('/exchanges'),
  updateStatus: (id, status) => api.put(`/exchanges/${id}`, { status }),
};

export default api; 