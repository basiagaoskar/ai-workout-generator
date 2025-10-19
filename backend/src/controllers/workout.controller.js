import { generateWorkoutPlan } from "../services/workout.service.js";

export const generateWorkout = async (req, res) => {
	try {
		const workoutPlan = await generateWorkoutPlan(req.body, req.user.id);
		res.status(200).json(workoutPlan);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
