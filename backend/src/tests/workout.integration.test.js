import { jest } from "@jest/globals";
import request from "supertest";
import { PrismaClient } from "../generated/prisma/client.js";

jest.unstable_mockModule("@google/genai", () => ({
	GoogleGenAI: jest.fn(() => ({
		models: {
			generateContent: jest.fn(() => ({
				candidates: [
					{
						content: {
							parts: [
								{
									text: JSON.stringify({
										planName: "Test AI Generated Plan",
										days: [
											{
												day: 1,
												focus: "Full Body Test Day",
												exercises: [
													{ name: "Squat", sets: 3, reps: "8-12" },
													{ name: "Push-up", sets: 3, reps: "to failure" },
												],
											},
										],
									}),
								},
							],
						},
					},
				],
			})),
		},
	})),
}));

const { default: app } = await import("../index.js");

const prisma = new PrismaClient();
const api = request(app);

let userCookie;
let generatedWorkoutPlanId;
let workoutDayId;
let savedWorkoutSessionId;
let savedExerciseId;

const testUser = {
	firstName: "WorkoutTest",
	lastName: "User",
	email: "workout.test.user@example.com",
	password: "Password123",
};

const workoutPreferences = {
	Goal: "muscle_gain",
	Gender: "man",
	Experience: "intermediate",
	Equipment: "bodyweight",
	Frequency: "4_5",
};

beforeAll(async () => {
	await prisma.user.deleteMany({ where: { email: testUser.email } });

	const res = await api.post("/auth/signup").send(testUser);
	const cookies = res.headers["set-cookie"];
	userCookie = cookies.find((c) => c.startsWith("jwt="));

	await prisma.exercise.upsert({
		where: { name: "Squat" },
		update: {},
		create: { name: "Squat", targetMuscle: "Legs", equipment: ["bodyweight"] },
	});
	await prisma.exercise.upsert({
		where: { name: "Push-up" },
		update: {},
		create: { name: "Push-up", targetMuscle: "Chest", equipment: ["bodyweight"] },
	});
});

afterAll(async () => {
	await prisma.user.deleteMany({ where: { email: testUser.email } });
	await prisma.$disconnect();
});

describe("Workout Integration Tests", () => {
	it("POST /workout/generate: generates workout plan (200)", async () => {
		const res = await api.post("/workout/generate").set("Cookie", userCookie).send(workoutPreferences).expect(200);

		expect(res.body.planName).toBe("Test AI Generated Plan");

		generatedWorkoutPlanId = res.body.id;
		workoutDayId = res.body.days[0].id;
		savedExerciseId = res.body.days[0].exercises.find((e) => e.exercise.name === "Squat").id;
	});

	it("POST /workout/generate: should return 401 if user is unauthorized", async () => {
		await api.post("/workout/generate").send(workoutPreferences).expect(401);
	});

	it("POST /workout/generate: should fail if missing required parameters (400)", async () => {
		const invalidPreferences = { ...workoutPreferences, Goal: undefined };
		await api.post("/workout/generate").set("Cookie", userCookie).send(invalidPreferences).expect(400);
	});

	it("GET /workout/workout-plan/:id: should return 404 for non-existent plan", async () => {
		const nonExistentId = generatedWorkoutPlanId + 999;
		await api.get(`/workout/workout-plan/${nonExistentId}`).set("Cookie", userCookie).expect(404);
	});

	it("GET /workout/finished-workout/:id: should return 404 for non-existent session", async () => {
		const nonExistentId = (savedWorkoutSessionId || 1) + 999;
		await api.get(`/workout/finished-workout/${nonExistentId}`).set("Cookie", userCookie).expect(404);
	});

	it("GET /workout/workout-plan/all: retrieves list of plans (200)", async () => {
		const res = await api.get("/workout/workout-plan/all").set("Cookie", userCookie).expect(200);
		expect(res.body.totalWorkoutPlans).toBe(1);
		expect(res.body.data[0].id).toBe(generatedWorkoutPlanId);
	});

	it("GET /workout/workout-plan/:id: retrieves specific plan (200)", async () => {
		const res = await api.get(`/workout/workout-plan/${generatedWorkoutPlanId}`).set("Cookie", userCookie).expect(200);
		expect(res.body.id).toBe(generatedWorkoutPlanId);
	});

	it("GET /workout/day/:id: retrieves specific workout day (200)", async () => {
		const res = await api.get(`/workout/day/${workoutDayId}`).set("Cookie", userCookie).expect(200);
		expect(res.body.id).toBe(workoutDayId);
		expect(res.body.exercises).toHaveLength(2);
	});

	it("POST /workout/save: saves workout session (201)", async () => {
		const startTime = new Date();
		const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

		const res = await api
			.post("/workout/save")
			.set("Cookie", userCookie)
			.send({
				workoutDayId,
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				loggedSets: [
					{ exerciseId: savedExerciseId, setNumber: 1, weight: 60, reps: 10 },
					{ exerciseId: savedExerciseId, setNumber: 2, weight: 65, reps: 8 },
				],
			})
			.expect(201);

		savedWorkoutSessionId = res.body.id;
		expect(res.body.loggedSets.length).toBe(2);
	});

	it("GET /workout/finished-workout/all: retrieves list of finished workouts (200)", async () => {
		const res = await api.get("/workout/finished-workout/all").set("Cookie", userCookie).expect(200);
		expect(res.body.totalWorkoutCount).toBe(1);
		expect(res.body.data[0].id).toBe(savedWorkoutSessionId);
	});

	it("GET /workout/finished-workout/:id: retrieves specific finished workout session (200)", async () => {
		const res = await api.get(`/workout/finished-workout/${savedWorkoutSessionId}`).set("Cookie", userCookie).expect(200);
		expect(res.body.id).toBe(savedWorkoutSessionId);
		expect(res.body.loggedSets.length).toBe(2);
	});

	it("DELETE /workout/workout-plan/:id: should delete workout plan (200)", async () => {
		const generateRes = await api.post("/workout/generate").set("Cookie", userCookie).send(workoutPreferences).expect(200);

		const planIdToDelete = generateRes.body.id;

		const deleteRes = await api.delete(`/workout/workout-plan/${planIdToDelete}`).set("Cookie", userCookie).expect(200);

		expect(deleteRes.body.message).toBe("Workout plan deleted successfully");

		await api.get(`/workout/workout-plan/${planIdToDelete}`).set("Cookie", userCookie).expect(404);
	});

	it("DELETE /workout/workout-plan/:id: should return 401 when deleting without authorization", async () => {
		await api.delete(`/workout/workout-plan/${generatedWorkoutPlanId}`).expect(401);
	});
});
