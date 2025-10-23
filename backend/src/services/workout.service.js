import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "../generated/prisma/client.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const prisma = new PrismaClient();

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateWorkoutPlan = async (preferences, userId) => {
	const { Goal, Gender, Experience, Equipment, Frequency } = preferences;

	const prompt = `
		You are a fitness expert. Create a personalized training plan as a JSON object.
		User is: ${Gender}, Level: ${Experience}.
		Goal: ${Goal}.
		Available equipment: ${Equipment}.
		Training frequency: ${Frequency} days per week.

		The response MUST be a JSON object only, without any additional text or markdown formatting. JSON format:
		{
			"planName": "Plan name (e.g., ${Goal} for ${Experience})",
			"days": [
				{
					"day": 1,
					"focus": "Focus of the day (e.g., Full Body, Upper Body)",
					"exercises": [
						{ "name": "Exercise name", "sets": 3, "reps": "8-12" },
						{ "name": "Next exercise", "sets": 3, "reps": "10-15" }
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
							create: day.exercises.map((exercise) => ({
								name: exercise.name,
								sets: exercise.sets,
								reps: exercise.reps,
							})),
						},
					})),
				},
			},
			include: {
				days: {
					include: {
						exercises: true,
					},
				},
			},
		});

		return savedPlan;
	} catch (e) {
		throw new Error("AI returned invalid data format");
	}
};

export const getAllWorkouts = async (userId, page = 1, limit = 10) => {
	const pageNum = parseInt(page);
	const limitNum = parseInt(limit);
	const skip = (pageNum - 1) * limitNum;

	const workouts = await prisma.workoutPlan.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "asc",
		},
		include: {
			days: {
				include: {
					exercises: true,
				},
			},
		},
		skip,
		take: limitNum,
	});

	return workouts;
};
