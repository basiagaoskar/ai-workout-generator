import { generateWorkoutPlan, getAllWorkouts } from "../services/workout.service.js";

export const generateWorkout = async (req, res) => {
	try {
		const workoutPlan = await generateWorkoutPlan(req.body, req.user.id);
		res.status(200).json(workoutPlan);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getUserWorkouts = async (req, res) => {
	try {
		const userId = req.user.id;
		const page = req.query.page || 1;
		const limit = req.query.limit || 10;

		const workouts = await getAllWorkouts(userId, page, limit);
		res.status(200).json(workouts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
