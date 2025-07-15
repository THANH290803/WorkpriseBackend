const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
}

const User = {
    login: (email, password, callback) => {
        const query = `
        SELECT 
            u.id,
            u.name,
            u.email,
            u.password,
            u.phone_number,
            u.address,
            u.avatar,
            r.name AS role_name,
            d.name AS department_name,
            t.name AS team_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        WHERE u.email = ?
    `;

        db.query(query, [email], async (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback({ message: 'Email không tồn tại' }, null);

            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) return callback({ message: 'Mật khẩu không đúng' }, null);

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '48h' }
            );

            callback(null, {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone_number,
                    address: user.address,
                    avatar: user.avatar,
                    role_name: user.role_name,
                    department_name: user.department_name,
                    team_name: user.team_name
                }
            });
        });
    },


    getAll: (callback) => {
        const query = `
        SELECT 
            u.id,
            u.name,
            u.email,
            u.phone_number,
            u.address,
            u.avatar,
            r.name AS role_name,
            d.name AS department_name,
            t.name AS team_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
    `;
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = `
        SELECT 
            u.id,
            u.name,
            u.email,
            u.phone_number,
            u.address,
            u.avatar,
            r.name AS role_name,
            c.name AS company_name,
            d.name AS department_name,
            t.name AS team_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN companies c ON u.company_id = c.id
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        WHERE u.id = ?
    `;
        db.query(query, [id], callback);
    },

    create: async (
        {
            name,
            email,
            password,
            phone_number,
            address,
            avatar,
            description,
            skill,
            certificate,
            status,
            role_id,
            department_id,
            team_id
        },
        callback
    ) => {
        try {
            if (!isStrongPassword(password)) {
                return callback(
                    {
                        message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.'
                    },
                    null
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = `
      INSERT INTO users 
      (name, email, password, phone_number, address, avatar, description, skill, certificate, status, role_id, department_id, team_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
            const values = [
                name,
                email,
                hashedPassword,
                phone_number,
                address,
                avatar,
                description,
                skill,
                certificate,
                status,
                role_id,
                department_id,
                team_id
            ];
            db.query(sql, values, callback);
        } catch (err) {
            callback(err, null);
        }
    },

    update: async (
        id,
        {
            name,
            email,
            password,
            phone_number,
            address,
            avatar,
            description,
            skill,
            certificate,
            status,
            role_id,
            department_id,
            team_id
        },
        callback
    ) => {
        try {
            if (!isStrongPassword(password)) {
                return callback(
                    {
                        message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.'
                    },
                    null
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = `
      UPDATE users 
      SET name = ?, email = ?, password = ?, phone_number = ?, address = ?, avatar = ?, description = ?, skill = ?, certificate = ?, status = ?, role_id = ?, department_id = ?, team_id = ?
      WHERE id = ?
    `;
            const values = [
                name,
                email,
                hashedPassword,
                phone_number,
                address,
                avatar,
                description,
                skill,
                certificate,
                status,
                role_id,
                department_id,
                team_id,
                id
            ];
            db.query(sql, values, callback);
        } catch (err) {
            callback(err, null);
        }
    },


    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    }
};

module.exports = User;
