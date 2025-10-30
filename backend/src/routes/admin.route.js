import express from "express";
import { getAllUsers } from "../controllers/admin.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { adminRoute } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, adminRoute, getAllUsers);

export default router;
