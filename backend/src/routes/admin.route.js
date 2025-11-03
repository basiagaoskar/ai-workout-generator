import express from "express";
import { getAllUsers, updateRole, removeUser } from "../controllers/admin.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { adminRoute } from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request or unauthorized
 */
router.get("/users", protectedRoute, adminRoute, getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}:
 *   put:
 *     summary: Update a user's role (only for admins)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose role will be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newRole
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid request or attempt to modify another admin
 */
router.put("/users/:userId", protectedRoute, adminRoute, updateRole);

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Failed to delete user
 */
router.delete("/users/:userId", protectedRoute, adminRoute, removeUser);

export default router;
