const bcrypt = require('bcryptjs');
const userModel = require('../../api/models/userModel');


const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi' });
        }

        // Check if user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const newUser = await userModel.createUser(fullName, email, hashedPassword);

        res.status(201).json({ success: true, message: 'Pendaftaran berhasil', data: newUser });
    } catch (error) {
        console.error('Kesalahan Pendaftaran:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat pendaftaran' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan kata sandi wajib diisi' });
        }

        // Find user
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Exclude password from response
        const { password: _, ...userData } = user;

        res.status(200).json({ success: true, message: 'Login successful', data: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

module.exports = {
    register,
    login
};
