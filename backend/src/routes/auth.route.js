import express from "express";
import { checkAuth, signup, login, logout, updateUser, updatePassword } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/check", protectedRoute, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/update-user", protectedRoute, updateUser);

router.post("/update-password", protectedRoute, updatePassword);

export default router;
