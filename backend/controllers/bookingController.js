const bookingModel = require('../../api/models/bookingModel');

// Fungsi untuk membuat pemesanan tiket baru
const createBooking = async (req, res) => {
    try {
        // Mengambil data pemesanan dari body request
        const { user_name, ticket_id, quantity, total_price } = req.body;

         // Memeriksa apakah semua data yang dibutuhkan sudah diisi
        if (!user_name || !ticket_id || !quantity || !total_price) {
            return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi' });
        }

         // Menyimpan data pemesanan ke database
        const newBooking = await bookingModel.createBooking(user_name, ticket_id, quantity, total_price);
        
        // Mengirim respons berhasil beserta data pemesanan yang telah dibuat
        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {

        // Menampilkan pesan kesalahan pada server
        console.error('Kesalahan saat membuat pemesanan:', error);

        // Mengirim respons jika terjadi kesalahan pada server
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};


// Fungsi untuk mengambil seluruh riwayat pemesanan
const getHistory = async (req, res) => {
    try {
        const history = await bookingModel.getAllBookings();
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error('Kesalahan saat mengambil riwayat pemesanan:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    createBooking,
    getHistory
};
