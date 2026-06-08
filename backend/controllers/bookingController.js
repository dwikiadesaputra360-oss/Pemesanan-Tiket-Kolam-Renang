const bookingModel = require('../../api/models/bookingModel');

const createBooking = async (req, res) => {
    try {
        const { user_name, ticket_id, quantity, total_price } = req.body;
        
        if (!user_name || !ticket_id || !quantity || !total_price) {
            return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi' });
        }

        const newBooking = await bookingModel.createBooking(user_name, ticket_id, quantity, total_price);
        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        console.error('Kesalahan saat membuat pemesanan:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await bookingModel.getAllBookings();
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error('Kesalahan saat mengambil riwayat pemesanan:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createBooking,
    getHistory
};
