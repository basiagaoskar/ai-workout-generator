import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { generateWorkout, getOneWorkout, getUserWorkouts, saveWorkout } from "../controllers/workout.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getUserWorkouts);

router.get("/one/:id", protectedRoute, getOneWorkout);

router.post("/generate", protectedRoute, generateWorkout);

router.post("/save", protectedRoute, saveWorkout);

export default router;
