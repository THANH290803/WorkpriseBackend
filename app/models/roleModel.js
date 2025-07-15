const db = require('../config/db');

const Role = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM roles';
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = 'SELECT * FROM roles WHERE id = ?';
        db.query(sql, [id], callback);
    },

    create: ({ name, description }, callback) => {
        const sql = 'INSERT INTO roles (name, description) VALUES (?, ?)';
        db.query(sql, [name, description || null], callback);
    },

    update: (id, { name, description }, callback) => {
        const sql = 'UPDATE roles SET name = ?, description = ? WHERE id = ?';
        db.query(sql, [name, description || null, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM roles WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Role;
