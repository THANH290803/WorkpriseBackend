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
        const { name, email, head_of_department } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên phòng ban là bắt buộc' });
        if (!head_of_department) return res.status(400).json({ message: 'Phải chọn trưởng phòng' });

        Department.checkIsManager(head_of_department, (err, isManager) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isManager.length) return res.status(400).json({ message: 'Người này không có vai trò Trưởng phòng' });

            Department.checkDuplicate({ name, email, head_of_department }, null, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                if (results.length > 0) {
                    const errors = [];
                    results.forEach(item => {
                        if (item.name === name) errors.push('Tên đã tồn tại');
                        if (item.email === email) errors.push('Email đã tồn tại');
                        if (item.head_of_department === head_of_department) errors.push('Người này đã là trưởng phòng khác');
                    });
                    return res.status(400).json({ message: errors.join(', ') });
                }

                Department.create(req.body, (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    Department.updateUserRole(head_of_department, (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.status(201).json({ message: 'Tạo phòng ban thành công và đã gán trưởng phòng' });
                    });
                });
            });
        });
    },

    update: (req, res) => {
        const { id } = req.params;
        const { name, email, head_of_department } = req.body;

        if (!name) return res.status(400).json({ message: 'Tên phòng ban là bắt buộc' });
        if (!head_of_department) return res.status(400).json({ message: 'Phải chọn trưởng phòng' });

        Department.checkIsManager(head_of_department, (err, isManager) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isManager.length) return res.status(400).json({ message: 'Người này không có vai trò Trưởng phòng' });

            Department.checkDuplicate({ name, email, head_of_department }, id, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                if (results.length > 0) {
                    const errors = [];
                    results.forEach(item => {
                        if (item.name === name) errors.push('Tên đã tồn tại');
                        if (item.email === email) errors.push('Email đã tồn tại');
                        if (item.head_of_department === head_of_department) errors.push('Người này đã là trưởng phòng khác');
                    });
                    return res.status(400).json({ message: errors.join(', ') });
                }

                Department.update(id, req.body, (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    Department.updateUserRole(head_of_department, (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: 'Cập nhật phòng ban thành công và gán trưởng phòng' });
                    });
                });
            });
        });
    },

    delete: (req, res) => {
        Department.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Xóa phòng ban thành công' });
        });
    }
};

module.exports = departmentController;
