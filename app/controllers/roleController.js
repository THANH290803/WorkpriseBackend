const Role = require('../models/roleModel');

const roleController = {
    getAllRoles: (req, res) => {
        Role.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getRoleById: (req, res) => {
        const id = req.params.id;
        Role.getById(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result.length) return res.status(404).json({ message: 'Không tìm thấy role' });
            res.json(result[0]);
        });
    },

    createRole: (req, res) => {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên role là bắt buộc' });

        Role.create({ name, description }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Đã tạo role', id: result.insertId });
        });
    },

    updateRole: (req, res) => {
        const id = req.params.id;
        const data = req.body;

        // Nếu có gửi name, thì bắt buộc không được rỗng
        if (data.hasOwnProperty('name') && data.name === '') {
            return res.status(400).json({ message: 'Tên role là bắt buộc' });
        }

        // Nếu không gửi gì cả
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Không có dữ liệu để cập nhật' });
        }

        Role.update(id, data, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Cập nhật role thành công' });
        });
    },


    deleteRole: (req, res) => {
        const id = req.params.id;
        Role.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Xóa role thành công' });
        });
    }
};

module.exports = roleController;
