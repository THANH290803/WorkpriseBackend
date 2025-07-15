const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Quản lý nhóm (Team) người dùng
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Lấy danh sách nhóm
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách các nhóm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                     nullable: true
 */
router.get('/', authMiddleware, teamController.getAllTeams);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Lấy thông tin nhóm theo ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của nhóm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về thông tin nhóm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Không tìm thấy nhóm
 */
router.get('/:id', authMiddleware, teamController.getTeamById);

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Tạo nhóm mới
 *     tags: [Teams]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Tạo nhóm thành công
 */
router.post('/', authMiddleware, teamController.createTeam);

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Cập nhật nhóm
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của nhóm
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Cập nhật nhóm thành công
 */
router.put('/:id', authMiddleware, teamController.updateTeam);

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Xóa nhóm
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của nhóm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa nhóm thành công
 */
router.delete('/:id', authMiddleware, teamController.deleteTeam);

module.exports = router;
