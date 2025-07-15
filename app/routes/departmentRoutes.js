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
 *         description: Danh sách phòng ban
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   name: { type: string }
 *                   address: { type: string, nullable: true }
 *                   email: { type: string, nullable: true }
 *                   description: { type: string, nullable: true }
 *                   date_of_establishment: { type: string, format: date, nullable: true }
 *                   head_of_department: { type: integer, nullable: true }
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
 *       - name: id
 *         in: path
 *         description: ID phòng ban
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin phòng ban
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 address: { type: string, nullable: true }
 *                 email: { type: string, nullable: true }
 *                 description: { type: string, nullable: true }
 *                 date_of_establishment: { type: string, format: date, nullable: true }
 *                 head_of_department: { type: integer, nullable: true }
 *       404:
 *         description: Không tìm thấy
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
 *             properties:
 *               name: { type: string }
 *               address: { type: string, nullable: true }
 *               email: { type: string, nullable: true }
 *               description: { type: string, nullable: true }
 *               date_of_establishment: { type: string, format: date, nullable: true }
 *               head_of_department: { type: integer, nullable: true }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, departmentController.create);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Cập nhật phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID phòng ban
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name: { type: string }
 *               address: { type: string, nullable: true }
 *               email: { type: string, nullable: true }
 *               description: { type: string, nullable: true }
 *               date_of_establishment: { type: string, format: date, nullable: true }
 *               head_of_department: { type: integer, nullable: true }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, departmentController.update);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Xóa phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID phòng ban
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', authMiddleware, departmentController.delete);

module.exports = router;
