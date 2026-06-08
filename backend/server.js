const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/booking', bookingRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API Pemesanan Tiket Kolam Renang' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
