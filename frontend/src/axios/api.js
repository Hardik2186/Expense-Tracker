// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // backend base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token automatically if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
