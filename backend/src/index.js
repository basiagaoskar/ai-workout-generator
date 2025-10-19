import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import workoutRoutes from "./routes/workout.route.js";

const PORT = 3000;
const app = express();

dotenv.config({ quiet: true });

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/auth", authRoutes);
app.use("/workout", workoutRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
