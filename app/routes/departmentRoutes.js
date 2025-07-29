const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Quản lý phòng ban
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Lấy danh sách phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', authMiddleware, departmentController.getAll);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Lấy thông tin phòng ban theo ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id', authMiddleware, departmentController.getById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Tạo phòng ban mới
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - head_of_department
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *               description:
 *                 type: string
 *               date_of_establishment:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Đã tạo thành công
 */
router.post('/', authMiddleware, departmentController.create);

/**
 * @swagger
 * /departments/{id}:
 *   patch:
 *     summary: Cập nhật phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *               description:
 *                 type: string
 *               date_of_establishment:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Đã cập nhật
 */
router.patch('/:id', authMiddleware, departmentController.update);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Xóa phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Đã xóa
 */
router.delete('/:id', authMiddleware, departmentController.delete);

module.exports = router;
