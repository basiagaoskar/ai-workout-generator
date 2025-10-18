import express from "express";
import { checkAuth, signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/check", checkAuth);

router.post("/signup", signup);

router.post("/login", login);

export default router;
