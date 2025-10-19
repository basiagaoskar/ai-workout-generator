import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { generateWorkout } from "../controllers/workout.controller.js";

const router = express.Router();

router.post("/generate", protectedRoute, generateWorkout);

export default router;
