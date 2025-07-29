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

    update: (id, data, callback) => {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return callback(null, { message: 'Không có trường nào để cập nhật' });
        }

        const fields = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => data[key]);
        values.push(id); // thêm id vào cuối

        const sql = `UPDATE roles SET ${fields} WHERE id = ?`;
        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM roles WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Role;
