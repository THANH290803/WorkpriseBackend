const db = require('../config/db');

const Department = {
    getAll: (callback) => {
        db.query('SELECT * FROM departments', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM departments WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        const {
            name,
            address,
            email,
            description,
            date_of_establishment,
            head_of_department
        } = data;

        const sql = `
            INSERT INTO departments 
            (name, address, email, description, date_of_establishment, head_of_department)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            name,
            address || null,
            email || null,
            description || null,
            date_of_establishment || null,
            head_of_department || null
        ], callback);
    },

    update: (id, data, callback) => {
        const {
            name,
            address,
            email,
            description,
            date_of_establishment,
            head_of_department
        } = data;

        const sql = `
            UPDATE departments 
            SET name = ?, address = ?, email = ?, description = ?, date_of_establishment = ?, head_of_department = ?
            WHERE id = ?
        `;

        db.query(sql, [
            name,
            address || null,
            email || null,
            description || null,
            date_of_establishment || null,
            head_of_department || null,
            id
        ], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM departments WHERE id = ?', [id], callback);
    },

    checkDuplicate: ({ name, email, head_of_department }, excludeId = null, callback) => {
        let sql = `
            SELECT * FROM departments 
            WHERE (name = ? OR email = ? OR head_of_department = ?)
        `;

        const values = [name, email, head_of_department];

        if (excludeId) {
            sql += ` AND id != ?`;
            values.push(excludeId);
        }

        db.query(sql, values, callback);
    }
};

module.exports = Department;
