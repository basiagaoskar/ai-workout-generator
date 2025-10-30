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

router.get("/workout-plan/all", protectedRoute, getAllWorkoutPlans);

router.get("/workout-plan/:id", protectedRoute, getOneWorkoutPlan);

router.get("/day/:id", protectedRoute, getWorkoutDay);

router.get("/finished-workout/all", protectedRoute, getAllFinishedWorkouts);

router.get("/finished-workout/:id", protectedRoute, getFinishedWorkout);

router.post("/generate", protectedRoute, generateWorkout);

router.post("/save", protectedRoute, saveWorkout);

export default router;
