import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "../generated/prisma/index.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const prisma = new PrismaClient();

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const getAvailableExercises = async (equipmentKey) => {
	let equipmentFilter = [];

	switch (equipmentKey) {
		case "bodyweight":
			equipmentFilter = ["bodyweight"];
			break;
		case "bands_only":
			equipmentFilter = ["bodyweight", "bands_only"];
			break;
		case "home_weights":
			equipmentFilter = ["bodyweight", "bands_only", "home_weights"];
			break;
		case "full_gym":
			return prisma.exercise.findMany();
		default:
			equipmentFilter = ["bodyweight"];
	}

	return prisma.exercise.findMany({
		where: {
			equipment: {
				hasSome: equipmentFilter,
			},
		},
	});
};

export const getAllExercises = async () => {
	try {
		const exercises = await prisma.exercise.findMany({
			select: {
				id: true,
				name: true,
				targetMuscle: true,
				equipment: true,
			},
			orderBy: {
				name: "asc",
			},
		});
		return exercises;
	} catch (error) {
		throw new Error("Failed to fetch all exercises.");
	}
};

export const generateWorkoutPlan = async (preferences, userId) => {
	const { Goal, Gender, Experience, Equipment, Frequency } = preferences;

	const availableExercises = await getAvailableExercises(Equipment);
	if (availableExercises.length === 0) {
		throw new Error("No exercises found for the selected equipment.");
	}

	const exerciseNames = availableExercises.map((ex) => ex.name);

	const prompt = `
		You are a fitness expert. Create a personalized training plan as a JSON object.
		User is: ${Gender}, Level: ${Experience}.
		Goal: ${Goal}.
		Training frequency: ${Frequency} days per week.

		You MUST create the plan using ONLY exercises from this list:
		[${exerciseNames.join(", ")}]

		The response MUST be a JSON object only, without any additional text or markdown formatting.
		The JSON format MUST be:
		{
			"planName": "Plan name (e.g., ${Goal} for ${Experience})",
			"days": [
				{
					"day": 1,
					"focus": "Focus of the day (e.g., Full Body, Upper Body)",
					"exercises": [
						{ "name": "Exercise name from list", "sets": 3, "reps": "8-12" },
						{ "name": "Next exercise from list", "sets": 3, "reps": "10-15" }
					]
				}
			]
		}
	`;

	const response = await ai.models.generateContent({
		//if one model is overloaded try different one
		model: "gemini-2.5-flash",
		// model: "gemini-2.0-flash",
		contents: prompt,
	});

	let text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

	const cleanedText = text
		.trim()
		.replace(/```json\s*/gi, "")
		.replace(/```/g, "")
		.replace(/^\s+|\s+$/g, "");

	try {
		const workoutJSON = JSON.parse(cleanedText);

		const savedPlan = await prisma.workoutPlan.create({
			data: {
				planName: workoutJSON.planName,
				userId: userId,
				days: {
					create: workoutJSON.days.map((day) => ({
						dayNumber: day.day,
						focus: day.focus,
						exercises: {
							create: day.exercises.map((exercise) => {
								const exerciseRecord = availableExercises.find((ex) => ex.name === exercise.name);

								if (!exerciseRecord) {
									throw new Error(`AI returned an invalid exercise name: ${exercise.name}`);
								}

								return {
									sets: exercise.sets,
									reps: exercise.reps,
									exerciseId: exerciseRecord.id,
								};
							}),
						},
					})),
				},
			},
			include: {
				days: {
					include: {
						exercises: {
							include: {
								exercise: true,
							},
						},
					},
				},
			},
		});

		return savedPlan;
	} catch (e) {
		throw new Error("AI returned invalid data format or invalid exercise.");
	}
};

export const getAllGeneratedWorkoutPlans = async (userId, page = 1, limit = 8) => {
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);
	const skip = (pageNum - 1) * limitNum;

	try {
		const [workoutPlans, totalCount] = await Promise.all([
			prisma.workoutPlan.findMany({
				where: {
					userId,
				},
				orderBy: {
					createdAt: "desc",
				},
				skip,
				take: limitNum,
				include: {
					days: {
						orderBy: {
							dayNumber: "asc",
						},
						include: {
							exercises: {
								include: {
									exercise: true,
								},
							},
						},
					},
				},
			}),
			prisma.workoutPlan.count({
				where: {
					userId: userId,
				},
			}),
		]);

		return {
			data: workoutPlans,
			totalWorkoutPlansPages: Math.ceil(totalCount / limitNum),
			currentWorkoutPlansPage: pageNum,
			totalWorkoutPlans: totalCount,
		};
	} catch (error) {
		throw new Error("Could not retrieve workout plans");
	}
};

export const getWorkoutPlanById = async (workoutId, userId) => {
	try {
		const workoutPlan = await prisma.workoutPlan.findUnique({
			where: {
				id: parseInt(workoutId),
				userId: userId,
			},
			include: {
				days: {
					orderBy: {
						dayNumber: "asc",
					},
					include: {
						exercises: {
							include: {
								exercise: true,
							},
						},
					},
				},
			},
		});

		if (!workoutPlan) {
			throw new Error("Could not find workout plan");
		}

		return workoutPlan;
	} catch (error) {
		throw new Error("Could not retrieve workout plan");
	}
};

export const getWorkoutDayById = async (workoutDayId, userId) => {
	try {
		const workoutDay = await prisma.workoutDay.findUnique({
			where: {
				id: parseInt(workoutDayId),
			},
			include: {
				exercises: {
					orderBy: { id: "asc" },
					include: {
						exercise: true,
					},
				},
				plan: {
					select: {
						userId: true,
					},
				},
			},
		});

		if (!workoutDay) {
			throw new Error("Workout day not found.");
		}

		if (workoutDay.plan.userId !== userId) {
			throw new Error("Unauthorized to access this workout day.");
		}

		const { plan, ...rest } = workoutDay;
		return rest;
	} catch (error) {
		throw new Error("Failed to fetch workout day: " + error.message);
	}
};

export const getFinishedWorkoutById = async (workoutId, userId) => {
	try {
		const finishedWorkout = await prisma.workoutSession.findUnique({
			where: {
				id: parseInt(workoutId),
				userId: userId,
			},
			include: {
				loggedSets: {
					include: {
						exercise: true,
					},
				},
				workoutDay: {
					include: {
						plan: true,
					},
				},
			},
		});

		if (!finishedWorkout) {
			throw new Error("Could not find finished workout");
		}

		return finishedWorkout;
	} catch (error) {
		throw new Error("Could not retrieve finished workout");
	}
};

export const getAllWorkouts = async (userId, page = 1, limit = 8) => {
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);
	const skip = (pageNum - 1) * limitNum;

	try {
		const [finishedWorkouts, totalCount] = await Promise.all([
			prisma.workoutSession.findMany({
				where: {
					userId: userId,
				},
				orderBy: {
					startTime: "desc",
				},
				skip,
				take: limitNum,
				include: {
					workoutDay: {
						include: {
							plan: true,
						},
					},
					loggedSets: true,
				},
			}),
			prisma.workoutSession.count({
				where: {
					userId: userId,
				},
			}),
		]);

		return {
			data: finishedWorkouts,
			totalWorkoutPages: Math.ceil(totalCount / limitNum),
			currentWorkoutPage: pageNum,
			totalWorkoutCount: totalCount,
		};
	} catch (error) {
		throw new Error("Could not retrieve finished workouts");
	}
};

const getExerciseIdByWorkoutExerciseId = async (workoutExerciseId) => {
	const workoutExercise = await prisma.workoutExercise.findUnique({
		where: { id: workoutExerciseId },
		select: { exerciseId: true },
	});
	if (!workoutExercise) {
		throw new Error(`WorkoutExercise with ID ${workoutExerciseId} not found.`);
	}
	return workoutExercise.exerciseId;
};

export const saveWorkoutSession = async (userId, data) => {
	const { workoutDayId, startTime, endTime, loggedSets } = data;

	try {
		const logsWithCorrectIds = await Promise.all(
			loggedSets.map(async (set) => {
				const globalExerciseId = await getExerciseIdByWorkoutExerciseId(set.exerciseId);

				return {
					setNumber: set.setNumber,
					weight: set.weight,
					reps: set.reps,
					exerciseId: globalExerciseId,
					workoutExerciseRefId: set.exerciseId,
				};
			})
		);

		const finishedWorkout = await prisma.workoutSession.create({
			data: {
				userId,
				workoutDayId: workoutDayId,
				startTime: new Date(startTime),
				endTime: new Date(endTime),
				loggedSets: {
					create: logsWithCorrectIds,
				},
			},
			include: {
				loggedSets: {
					include: {
						exercise: true,
					},
				},
				workoutDay: true,
			},
		});

		return finishedWorkout;
	} catch (error) {
		throw new Error("Failed to save workout session");
	}
};

export const saveCustomWorkoutSession = async (userId, data) => {
	const { name, startTime, endTime, loggedSets } = data;

	try {
		const finishedWorkout = await prisma.workoutSession.create({
			data: {
				userId,
				name: name || null,
				startTime: new Date(startTime),
				endTime: new Date(endTime),
				loggedSets: {
					create: loggedSets.map((set) => ({
						setNumber: set.setNumber,
						weight: set.weight,
						reps: set.reps,
						exerciseId: set.exerciseId,
					})),
				},
			},
			include: {
				loggedSets: {
					include: {
						exercise: true,
					},
				},
			},
		});

		return finishedWorkout;
	} catch (error) {
		throw new Error("Failed to save workout session");
	}
};
