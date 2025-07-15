const db = require('../config/db');

const Team = {
    getAll: (callback) => {
        db.query('SELECT * FROM teams', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM teams WHERE id = ?', [id], callback);
    },

    create: ({ name, description }, callback) => {
        db.query(
            'INSERT INTO teams (name, description) VALUES (?, ?)',
            [name, description || null],
            callback
        );
    },

    update: (id, { name, description }, callback) => {
        db.query(
            'UPDATE teams SET name = ?, description = ? WHERE id = ?',
            [name, description || null, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM teams WHERE id = ?', [id], callback);
    }
};

module.exports = Team;
