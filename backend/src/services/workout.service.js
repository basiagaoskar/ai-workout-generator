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

export const getAllWorkouts = async (userId, page = 1, limit = 10) => {
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
			totalPages: Math.ceil(totalCount / limitNum),
			currentPage: pageNum,
			totalCount: totalCount,
		};
	} catch (error) {
		throw new Error("Could not retrieve workout plans");
	}
};

export const getWorkoutById = async (workoutId, userId) => {
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

export const saveWorkoutSession = async (userId, data) => {
	const { workoutDayId, startTime, endTime, loggedSets } = data;

	try {
		const finishedWorkout = await prisma.workoutSession.create({
			data: {
				userId,
				workoutDayId,
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
						exercise: {
							include: {
								exercise: true,
							},
						},
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
