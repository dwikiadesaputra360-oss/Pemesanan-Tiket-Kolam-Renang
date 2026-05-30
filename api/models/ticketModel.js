const db = require('../db');

const getAllTickets = async () => {
    const result = await db.query('SELECT * FROM tickets ORDER BY id ASC');
    return result.rows;
};

const getTicketById = async (id) => {
    const result = await db.query('SELECT * FROM tickets WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    getAllTickets,
    getTicketById
};
