const User = require('../models/userModel');

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.login(email, password, (err, result) => {
        if (err) return res.status(401).json({ error: err.message });
        res.json({ message: 'Đăng nhập thành công', ...result });
    });
};

exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    User.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};

exports.createUser = (req, res) => {
    User.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'User created', id: result.insertId });
    });
};

exports.updateUser = (req, res) => {
    User.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'User updated' });
    });
};

exports.deleteUser = (req, res) => {
    User.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'User deleted' });
    });
};