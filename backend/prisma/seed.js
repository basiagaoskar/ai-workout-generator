import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

const exerciseList = [
	{ name: "Bench Press", targetMuscle: "Chest", equipment: ["full_gym", "home_weights"] },
	{ name: "Push-up", targetMuscle: "Chest", equipment: ["bodyweight"] },
	{ name: "Dumbbell Flyes", targetMuscle: "Chest", equipment: ["full_gym", "home_weights"] },

	{ name: "Pull-up", targetMuscle: "Back", equipment: ["full_gym", "bodyweight"] },
	{ name: "Deadlift", targetMuscle: "Back", equipment: ["full_gym", "home_weights"] },
	{ name: "Bent-over Row", targetMuscle: "Back", equipment: ["full_gym", "home_weights"] },
	{ name: "Lat Pulldown", targetMuscle: "Back", equipment: ["full_gym"] },

	{ name: "Squat", targetMuscle: "Legs", equipment: ["bodyweight", "home_weights", "full_gym"] },
	{ name: "Lunge", targetMuscle: "Legs", equipment: ["bodyweight", "home_weights", "full_gym"] },
	{ name: "Leg Press", targetMuscle: "Legs", equipment: ["full_gym"] },
	{ name: "Calf Raise", targetMuscle: "Legs", equipment: ["bodyweight", "home_weights", "full_gym"] },

	{ name: "Overhead Press", targetMuscle: "Shoulders", equipment: ["full_gym", "home_weights"] },
	{ name: "Lateral Raise", targetMuscle: "Shoulders", equipment: ["full_gym", "home_weights", "bands_only"] },
	{ name: "Face Pull", targetMuscle: "Shoulders", equipment: ["full_gym", "bands_only"] },

	{ name: "Bicep Curl", targetMuscle: "Arms", equipment: ["full_gym", "home_weights", "bands_only"] },
	{ name: "Tricep Pushdown", targetMuscle: "Arms", equipment: ["full_gym", "bands_only"] },
	{ name: "Tricep Dip", targetMuscle: "Arms", equipment: ["bodyweight"] },

	{ name: "Plank", targetMuscle: "Core", equipment: ["bodyweight"] },
	{ name: "Crunch", targetMuscle: "Core", equipment: ["bodyweight"] },
	{ name: "Leg Raise", targetMuscle: "Core", equipment: ["bodyweight"] },

	{ name: "Burpee", targetMuscle: "Full Body", equipment: ["bodyweight"] },
	{ name: "Jumping Jacks", targetMuscle: "Full Body", equipment: ["bodyweight"] },
	{ name: "Kettlebell Swing", targetMuscle: "Full Body", equipment: ["home_weights", "full_gym"] },
	{ name: "Resistance Band Squat", targetMuscle: "Legs", equipment: ["bands_only"] },
];

async function main() {
	console.log("Start seeding exercises...");
	const result = await prisma.exercise.createMany({
		data: exerciseList,
		skipDuplicates: true,
	});
	console.log(`Finished seeding. Added ${result.count} new exercises.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
