import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
		model: "gemini-2.5-flash",
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

		return workoutJSON;
	} catch (e) {
		throw new Error("AI returned invalid data format");
	}
};
