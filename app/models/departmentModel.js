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
        } = data;

        const sql = `
            INSERT INTO departments 
            (name, address, email, description, date_of_establishment)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            name,
            address || null,
            email || null,
            description || null,
            date_of_establishment || null
        ], callback);
    },

    update: (id, data, callback) => {
        const allowedFields = [
            'name',
            'address',
            'email',
            'description',
            'date_of_establishment'
        ];

        const keys = Object.keys(data).filter(key => allowedFields.includes(key));
        if (keys.length === 0) {
            return callback(null, { message: 'Không có trường nào để cập nhật' });
        }

        const fields = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => data[key] ?? null); // nếu undefined thì gán null
        values.push(id);

        const sql = `UPDATE departments SET ${fields} WHERE id = ?`;
        db.query(sql, values, callback);
    }
    ,

    delete: (id, callback) => {
        db.query('DELETE FROM departments WHERE id = ?', [id], callback);
    },

    checkDuplicate: ({ name, email,  }, excludeId = null, callback) => {
        let sql = `
            SELECT * FROM departments 
            WHERE (name = ? OR email = ?)
        `;
        const values = [name, email, ];
        if (excludeId) {
            sql += ` AND id != ?`;
            values.push(excludeId);
        }
        db.query(sql, values, callback);
    },

    checkIsManager: (userId, callback) => {
        const sql = `
            SELECT u.id FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ? AND r.name = 'Trưởng phòng'
        `;
        db.query(sql, [userId], callback);
    },

    updateUserRole: (userId, callback) => {
        const getRoleQuery = `SELECT id FROM roles WHERE name = 'Trưởng phòng' LIMIT 1`;
        db.query(getRoleQuery, (err, results) => {
            if (err) return callback(err);
            if (!results.length) return callback(new Error('Không tìm thấy vai trò Trưởng phòng'));
            const roleId = results[0].id;
            const updateQuery = `UPDATE users SET role_id = ? WHERE id = ?`;
            db.query(updateQuery, [roleId, userId], callback);
        });
    }
};

module.exports = Department;
