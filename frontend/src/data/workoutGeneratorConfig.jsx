import React from "react";
import { Dumbbell, Target, Home, Calendar, Mars, Venus } from "lucide-react";

export const workoutGeneratorSteps = {
	Goal: {
		title: "What is your primary fitness goal?",
		options: [
			{ key: "muscle_gain", label: "Muscle Gain", icon: <Dumbbell /> },
			{ key: "fat_loss", label: "Fat Loss", icon: <Target /> },
			{ key: "endurance", label: "Endurance/Cardio", icon: <Home /> },
			{ key: "flexibility", label: "Flexibility/Mobility", icon: <Calendar /> },
		],
	},
	Gender: {
		title: "What is your gender?",
		options: [
			{ key: "man", label: "Man", icon: <Mars /> },
			{ key: "female", label: "Female", icon: <Venus /> },
		],
	},
	Experience: {
		title: "What is your current fitness level?",
		options: [
			{ key: "beginner", label: "Beginner (0-6 months)" },
			{ key: "intermediate", label: "Intermediate (6-24 months)" },
			{ key: "advanced", label: "Advanced (2+ years)" },
		],
	},
	Equipment: {
		title: "What equipment do you have access to?",
		options: [
			{ key: "full_gym", label: "Full Commercial Gym" },
			{ key: "home_weights", label: "Home Gym (Weights & Bench)" },
			{ key: "bodyweight", label: "Bodyweight Only" },
			{ key: "bands_only", label: "Resistance Bands Only" },
		],
	},
	Frequency: {
		title: "How many days per week can you train?",
		options: [
			{ key: "2_3", label: "2-3 Days" },
			{ key: "4_5", label: "4-5 Days" },
			{ key: "6_7", label: "6-7 Days (Advanced)" },
		],
	},
	Biometrics: {
		title: "Your Measurements",
		type: "input",
		fields: [
			{ key: "weight", label: "Weight (kg)" },
			{ key: "height", label: "Height (cm)" },
		],
	},
	Strength: {
		title: "Best Lifts (1 Rep Max)",
		type: "input",
		fields: [
			{ key: "bestBench", label: "Bench Press (kg)" },
			{ key: "bestSquat", label: "Squat (kg)" },
			{ key: "bestDeadlift", label: "Deadlift (kg)" },
		],
	},
};
