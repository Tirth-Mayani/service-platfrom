const pool = require('../config/db');

const generateId = async (table, column, prefix) => {
    const result = await pool.query(
        `SELECT ${column} FROM ${table} ORDER BY ${column} DESC LIMIT 1`
    );
    if(result.rows.length === 0) {
        return `${prefix}-001`;
    }
    
    const lastId = result.rows[0][column];
    const number = parseInt(lastId.split('-')[1], 10);
    const nextNumber = number + 1;
    return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;  // padStart(3, '0') is padding the number to 3 digits, if it is less than 3 digits
};

module.exports = generateId;