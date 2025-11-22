import express from "express";
import {
	checkAuth,
	signup,
	login,
	loginWithGoogle,
	logout,
	updateUser,
	updatePassword,
	deleteAccount,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /auth/check:
 *   get:
 *     summary: Check if the user is authenticated
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user
 *       401:
 *         description: Unauthorized
 */
router.get("/check", protectedRoute, checkAuth);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Pork
 *               email:
 *                 type: string
 *                 example: example@mail.com
 *               password:
 *                 type: string
 *                 example: "Password2115"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/signup", signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@mail.com
 *               password:
 *                 type: string
 *                 example: "Password2115"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Log in or sign up using Google OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID Token received from Google OAuth
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *       400:
 *         description: Invalid Google credential or authentication failed
 */
router.post("/google", loginWithGoogle);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/update-user:
 *   post:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goal:
 *                 type: string
 *                 example: "Lose weight"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               experience:
 *                 type: string
 *                 example: "Intermediate"
 *               equipment:
 *                 type: string
 *                 example: "Full gym"
 *               frequency:
 *                 type: string
 *                 example: "3 times per week"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.post("/update-user", protectedRoute, updateUser);

/**
 * @swagger
 * /auth/update-password:
 *   post:
 *     summary: Update user password
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "OldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 */
router.post("/update-password", protectedRoute, updatePassword);

/**
 * @swagger
 * /auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Error deleting account
 */
router.delete("/delete-account", protectedRoute, deleteAccount);

export default router;
