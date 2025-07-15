const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Không có token. Truy cập bị từ chối.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gán thông tin user cho req
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};
