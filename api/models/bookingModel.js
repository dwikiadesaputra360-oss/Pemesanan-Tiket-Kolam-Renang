const db = require('../db');

const createBooking = async (userName, ticketId, quantity, totalPrice, paymentProof) => {
    const query = `
        INSERT INTO bookings (user_name, ticket_id, quantity, total_price, payment_proof)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [userName, ticketId, quantity, totalPrice, paymentProof];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getAllBookings = async () => {
    const query = `
        SELECT b.*, t.name as ticket_name 
        FROM bookings b
        JOIN tickets t ON b.ticket_id = t.id
        ORDER BY b.created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
};

const deleteBooking = async (id) => {
    const query = `
        DELETE FROM bookings 
        WHERE id = $1 
        RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

module.exports = {
    createBooking,
    getAllBookings,
    deleteBooking
};
