import express from "express";
import { getAllUsers, updateRole, removeUser } from "../controllers/admin.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { adminRoute } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, adminRoute, getAllUsers);

router.put("/users/:userId", protectedRoute, adminRoute, updateRole);

router.delete("/users/:userId", protectedRoute, adminRoute, removeUser);

export default router;
