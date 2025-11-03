import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
	getAllWorkoutPlans,
	getOneWorkoutPlan,
	getWorkoutDay,
	getFinishedWorkout,
	getAllFinishedWorkouts,
	generateWorkout,
	saveWorkout,
} from "../controllers/workout.controller.js";

const router = express.Router();

/**
 * @swagger
 * /workouts/workout-plan/all:
 *   get:
 *     summary: Get all generated workout plans
 *     tags: [Workouts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of elements per page
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workout plans
 */
router.get("/workout-plan/all", protectedRoute, getAllWorkoutPlans);

/**
 * @swagger
 * /workouts/workout-plan/{id}:
 *   get:
 *     summary: Get a specific workout plan by ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: The requested workout plan
 */
router.get("/workout-plan/:id", protectedRoute, getOneWorkoutPlan);

/**
 * @swagger
 * /workouts/day/{id}:
 *   get:
 *     summary: Get details of a specific workout day
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Workout day data
 */
router.get("/day/:id", protectedRoute, getWorkoutDay);

/**
 * @swagger
 * /workouts/finished-workout/all:
 *   get:
 *     summary: Get all finished workouts (sessions)
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of finished workouts
 */
router.get("/finished-workout/all", protectedRoute, getAllFinishedWorkouts);

/**
 * @swagger
 * /workouts/finished-workout/{id}:
 *   get:
 *     summary: Get specific finished workout details
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Finished workout details
 */
router.get("/finished-workout/:id", protectedRoute, getFinishedWorkout);

/**
 * @swagger
 * /workouts/generate:
 *   post:
 *     summary: Generate a personalized workout plan
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Goal:
 *                 type: string
 *               Gender:
 *                 type: string
 *               Experience:
 *                 type: string
 *               Equipment:
 *                 type: string
 *               Frequency:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Generated workout plan
 */
router.post("/generate", protectedRoute, generateWorkout);

/**
 * @swagger
 * /workouts/save:
 *   post:
 *     summary: Save a completed workout session
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workoutDayId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               loggedSets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exerciseId:
 *                       type: integer
 *                     setNumber:
 *                       type: integer
 *                     reps:
 *                       type: integer
 *                     weight:
 *                       type: number
 *     responses:
 *       201:
 *         description: Workout saved successfully
 */
router.post("/save", protectedRoute, saveWorkout);

export default router;
