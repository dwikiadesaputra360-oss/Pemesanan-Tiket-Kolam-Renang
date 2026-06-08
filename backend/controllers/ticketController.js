const ticketModel = require('../../api/models/ticketModel');

// Fungsi untuk mengambil semua data tiket yang ada
const getAllTickets = async (req, res) => {
    try {
        // Fungsi untuk ambil data tiket dari database
        const tickets = await ticketModel.getAllTickets();
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        console.error('Kesalahan saat mengambil data tiket:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    getAllTickets
};
