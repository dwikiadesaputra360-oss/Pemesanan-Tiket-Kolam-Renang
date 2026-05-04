import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.100.138:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTickets = () => api.get('/tickets');
export const createBooking = (bookingData: any) => api.post('/booking', bookingData);
export const getBookingHistory = () => api.get('/booking');

// Auth endpoints
export const registerUser = (userData: any) => api.post('/auth/register', userData);
export const loginUser = (credentials: any) => api.post('/auth/login', credentials);

export default api;
