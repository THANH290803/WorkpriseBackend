const Team = require('../models/teamModel');

const teamController = {
    getAllTeams: (req, res) => {
        Team.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getTeamById: (req, res) => {
        const { id } = req.params;
        Team.getById(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result.length) return res.status(404).json({ message: 'Không tìm thấy nhóm' });
            res.json(result[0]);
        });
    },

    createTeam: (req, res) => {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên nhóm là bắt buộc' });

        Team.create({ name, description }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Đã tạo nhóm thành công', id: result.insertId });
        });
    },

    updateTeam: (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên nhóm là bắt buộc' });

        Team.update(id, { name, description }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Đã cập nhật nhóm thành công' });
        });
    },

    deleteTeam: (req, res) => {
        const { id } = req.params;
        Team.delete(id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Đã xóa nhóm thành công' });
        });
    }
};

module.exports = teamController;
