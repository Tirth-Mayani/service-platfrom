const pool = require('../config/db');

const createUser = async (data) => {  //creating new user while registration
    const {user_id, name, email, phone, password} = data;
    const result = await pool.query(`INSERT INTO users (user_id, name, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, name, email, phone, password]
    );

    return result.rows[0];
};

const updateUserRole = async (id, role) => {  //to update user role only by admin
    const result = await pool.query(`UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *`,
        [role, id]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => { //helper method used to find by email for checking unique email
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
    return result.rows[0];
};

const updateUser = async (user_id, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setQuery = keys.map((k,i) => `${k}=${i+1}`).join(', ');

    const result = await pool.query(`UPDATE users SET ${setQuery} WHERE user_id = $${keys.length + 1} RETURNING *`,
        [...values, user_id]
    );

    return result.rows[0];
};

const deleteUser = async (user_id) => {
    const result = await pool.query(
        `DELETE FROM users WHERE user_id = $1 RETURNING *`, [user_id]
    );

    return result.rows[0];
};

const gettAllUsers = async () => {
    const result = await pool.query(`SELECT user_id, name, email, phone, role, create_at FROM users`);
    return result.rows;
}

const getUserById = async (user_id) => {
    const result = await pool.query(`SELECT user_id, name, email, phone, role FROM users WHERE user_id = $1`, [user_id]);
    return result.rows[0];
}

const getUserByEmail = async (email) => {
    const result = await pool.query(`SELECT user_id, name, email, phone, role FROM users WHERE email = $1`, [email]);
    return result.rows[0];
}

module.exports = {createUser, updateUserRole, findUserByEmail, updateUser, deleteUser, gettAllUsers, getUserById, getUserByEmail};