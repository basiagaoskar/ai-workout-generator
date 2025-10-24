import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { generateWorkout, getOneWorkout, getUserWorkouts } from "../controllers/workout.controller.js";

const router = express.Router();

router.post("/generate", protectedRoute, generateWorkout);

router.get("/all", protectedRoute, getUserWorkouts);

router.get("/one/:id", protectedRoute, getOneWorkout);

export default router;
