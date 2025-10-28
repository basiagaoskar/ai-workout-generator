import { generateWorkoutPlan, getAllWorkouts, getWorkoutById, saveWorkoutSession } from "../services/workout.service.js";

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

export const getOneWorkout = async (req, res) => {
	try {
		const workoutId = req.params.id;
		const userId = req.user.id;

		const workout = await getWorkoutById(workoutId, userId);
		res.status(200).json(workout);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const saveWorkout = async (req, res) => {
	try {
		const userId = req.user.id;
		const session = await saveWorkoutSession(userId, req.body);
		res.status(201).json(session);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

