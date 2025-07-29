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
            d.name AS department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
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
                    department_name: user.department_name
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
            d.name AS department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
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
            d.name AS department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
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
            department_id
        },
        callback
    ) => {
        try {
            const checkDuplicateQuery = `
            SELECT * FROM users 
            WHERE name = ? OR email = ? OR phone_number = ?
        `;
            db.query(checkDuplicateQuery, [name, email, phone_number], async (err, dupResults) => {
                if (err) return callback(err, null);
                if (dupResults.length > 0) {
                    return callback({ message: 'Tên, email hoặc số điện thoại đã tồn tại' }, null);
                }

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
                (name, email, password, phone_number, address, avatar, description, skill, certificate, status, role_id, department_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    department_id
                ];
                db.query(sql, values, callback);
            });
        } catch (err) {
            callback(err, null);
        }
    },

    update: async (id, data, callback) => {
        try {
            // Lấy user hiện tại
            const getUserQuery = 'SELECT * FROM users WHERE id = ?';
            db.query(getUserQuery, [id], async (err, results) => {
                if (err || results.length === 0) {
                    return callback({ message: 'Không tìm thấy người dùng' }, null);
                }

                const currentUser = results[0];

                // Dùng dữ liệu mới nếu có, không thì giữ nguyên
                const updatedData = {
                    name: data.name ?? currentUser.name,
                    email: data.email ?? currentUser.email,
                    phone_number: data.phone_number ?? currentUser.phone_number,
                    address: data.address ?? currentUser.address,
                    avatar: data.avatar ?? currentUser.avatar,
                    description: data.description ?? currentUser.description,
                    skill: data.skill ?? currentUser.skill,
                    certificate: data.certificate ?? currentUser.certificate,
                    status: data.status ?? currentUser.status,
                    role_id: data.role_id ?? currentUser.role_id,
                    department_id: data.department_id ?? currentUser.department_id,
                    password: currentUser.password
                };

                // Nếu có cập nhật password
                if (data.password) {
                    if (!isStrongPassword(data.password)) {
                        return callback({
                            message: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.'
                        }, null);
                    }
                    updatedData.password = await bcrypt.hash(data.password, 10);
                }

                // Kiểm tra trùng lặp email/số điện thoại (nếu có thay đổi)
                const duplicateQuery = `
                SELECT * FROM users 
                WHERE (email = ? OR phone_number = ?) AND id != ?
            `;
                db.query(duplicateQuery, [updatedData.email, updatedData.phone_number, id], (err, dupResults) => {
                    if (err) return callback(err, null);
                    if (dupResults.length > 0) {
                        return callback({ message: 'Email hoặc số điện thoại đã tồn tại' }, null);
                    }

                    // Cập nhật
                    const updateQuery = `
                    UPDATE users SET 
                        name = ?, email = ?, password = ?, phone_number = ?, address = ?, avatar = ?,
                        description = ?, skill = ?, certificate = ?, status = ?, role_id = ?, department_id = ?
                    WHERE id = ?
                `;
                    const values = [
                        updatedData.name,
                        updatedData.email,
                        updatedData.password,
                        updatedData.phone_number,
                        updatedData.address,
                        updatedData.avatar,
                        updatedData.description,
                        updatedData.skill,
                        updatedData.certificate,
                        updatedData.status,
                        updatedData.role_id,
                        updatedData.department_id,
                        id
                    ];

                    db.query(updateQuery, values, callback);
                });
            });
        } catch (err) {
            callback(err, null);
        }
    },


    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    }
};

module.exports = User;
