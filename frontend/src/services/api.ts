import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

// Ticket endpoints
export const getTickets = () => api.get('/tickets');

export const createBooking = (bookingData: any) => api.post('/booking', bookingData);
export const getBookingHistory = () => api.get('/booking');
export const deleteBooking = (id: number) => api.delete(`/booking/${id}`);

// Auth endpoints
export const registerUser = (userData: any) => api.post('/auth/register', userData);
export const loginUser = (credentials: any) => api.post('/auth/login', credentials);

export default api;
