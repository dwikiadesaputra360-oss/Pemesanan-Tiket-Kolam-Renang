const db = require('../db');

const createUser = async (fullName, email, password) => {
    const query = `
        INSERT INTO users (full_name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, created_at;
    `;
    const values = [fullName, email, password];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
};

module.exports = {
    createUser,
    getUserByEmail
};
