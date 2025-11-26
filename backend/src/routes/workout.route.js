import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
	getAllWorkoutPlans,
	getExercises,
	getOneWorkoutPlan,
	getWorkoutDay,
	getFinishedWorkout,
	getAllFinishedWorkouts,
	generateWorkout,
	saveWorkout,
	saveCustomWorkout,
	deletePlan,
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutPlan'
 */
router.get("/workout-plan/all", protectedRoute, getAllWorkoutPlans);

/**
 * @swagger
 * /exercises/all:
 *   get:
 *     summary: Get all available exercises
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Failed to fetch exercises
 */
router.get("/exercises/all", protectedRoute, getExercises);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutPlan'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutDay'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutSession'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutSession'
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
 *                 example: "Lose weight"
 *               Gender:
 *                 type: string
 *                 example: "Male"
 *               Experience:
 *                 type: string
 *                 example: "Intermediate"
 *               Equipment:
 *                 type: string
 *                 example: "Full gym"
 *               Frequency:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Generated workout plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutPlan'
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
 *             $ref: '#/components/schemas/WorkoutSessionInput'
 *     responses:
 *       201:
 *         description: Workout saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutSession'
 */
router.post("/save", protectedRoute, saveWorkout);

/**
 * @swagger
 * /workouts/save-custom:
 *   post:
 *     summary: Save a custom workout session with logged sets
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutSessionInput'
 *     responses:
 *       201:
 *         description: Workout saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutSession'
 *       400:
 *         description: Failed to save workout session
 */
router.post("/save-custom", protectedRoute, saveCustomWorkout);

/**
 * @swagger
 * /workouts/workout-plan/{id}:
 *   delete:
 *     summary: Delete a workout plan by ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the workout plan to delete
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Workout plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workout plan deleted successfully
 *       400:
 *         description: Workout plan not found or user unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workout plan not found or unauthorized
 */
router.delete("/workout-plan/:id", protectedRoute, deletePlan);

export default router;
