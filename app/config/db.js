const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

connection.getConnection((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err);
  } else {
    console.log('✅ Đã kết nối MySQL thành công!');
  }
});

module.exports = connection;
