import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ticket Management Endpoints
export const getTickets = () => api.get('/tickets');
export const createTicket = (name: string, price: number) => api.post('/tickets', { name, price });
export const updateTicket = (id: number, name: string, price: number) => api.put(`/tickets/${id}`, { name, price });
export const deleteTicket = (id: number) => api.delete(`/tickets/${id}`);

// Booking Management Endpoints
export const getBookings = () => api.get('/booking');
export const deleteBooking = (id: number) => api.delete(`/booking/${id}`);

// User Management Endpoints
export const getUsers = () => api.get('/auth/users');

export default api;
