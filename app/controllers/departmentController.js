const Department = require('../models/departmentModel');

const departmentController = {
    getAll: (req, res) => {
        Department.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getById: (req, res) => {
        Department.getById(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result.length) return res.status(404).json({ message: 'Không tìm thấy phòng ban' });
            res.json(result[0]);
        });
    },

    create: (req, res) => {
        const { name, email } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên phòng ban là bắt buộc' });

        Department.checkDuplicate({ name, email }, null, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                const errors = [];
                results.forEach(item => {
                    if (item.name === name) errors.push('Tên đã tồn tại');
                    if (item.email === email) errors.push('Email đã tồn tại');
                });
                return res.status(400).json({ message: errors.join(', ') });
            }

            Department.create(req.body, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Tạo phòng ban thành công' });
            });
        });
    },

    update: (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;

        // Nếu không có trường nào được gửi thì không cần cập nhật
        if (!name && !email && !req.body.description && !req.body.address && !req.body.date_of_establishment) {
            return res.status(400).json({ message: 'Không có trường nào để cập nhật' });
        }

        // Kiểm tra trùng lặp nếu có name hoặc email
        if (name || email) {
            Department.checkDuplicate({ name, email }, id, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                const errors = [];
                results.forEach(item => {
                    if (name && item.name === name) errors.push('Tên đã tồn tại');
                    if (email && item.email === email) errors.push('Email đã tồn tại');
                });

                if (errors.length > 0) {
                    return res.status(400).json({ message: errors.join(', ') });
                }

                // Không trùng lặp => cập nhật
                Department.update(id, req.body, (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Cập nhật phòng ban thành công' });
                });
            });
        } else {
            // Nếu không cần kiểm tra name/email trùng lặp
            Department.update(id, req.body, (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Cập nhật phòng ban thành công' });
            });
        }
    },

    delete: (req, res) => {
        Department.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Xóa phòng ban thành công' });
        });
    }
};

module.exports = departmentController;
