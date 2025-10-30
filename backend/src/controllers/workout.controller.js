import {
	generateWorkoutPlan,
	getAllGeneratedWorkoutPlans,
	getWorkoutPlanById,
	getWorkoutDayById,
	getFinishedWorkoutById,
	getAllWorkouts,
	saveWorkoutSession,
} from "../services/workout.service.js";

export const generateWorkout = async (req, res) => {
	try {
		const workoutPlan = await generateWorkoutPlan(req.body, req.user.id);
		res.status(200).json(workoutPlan);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getAllWorkoutPlans = async (req, res) => {
	try {
		const userId = req.user.id;
		const page = req.query.page || 1;
		const limit = req.query.limit || 10;

		const workoutPlans = await getAllGeneratedWorkoutPlans(userId, page, limit);
		res.status(200).json(workoutPlans);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getOneWorkoutPlan = async (req, res) => {
	try {
		const workoutId = req.params.id;
		const userId = req.user.id;

		const workout = await getWorkoutPlanById(workoutId, userId);
		res.status(200).json(workout);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getWorkoutDay = async (req, res) => {
	try {
		const userId = req.user.id;
		const workoutDayId = req.params.id;
		const workoutDay = await getWorkoutDayById(workoutDayId, userId);
		res.status(200).json(workoutDay);
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};

export const getFinishedWorkout = async (req, res) => {
	try {
		const workoutId = req.params.id;
		const userId = req.user.id;
		const workout = await getFinishedWorkoutById(workoutId, userId);
		res.status(200).json(workout);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getAllFinishedWorkouts = async (req, res) => {
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

export const saveWorkout = async (req, res) => {
	try {
		const userId = req.user.id;
		const session = await saveWorkoutSession(userId, req.body);
		res.status(201).json(session);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
