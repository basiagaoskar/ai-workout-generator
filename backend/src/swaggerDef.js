const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Gym Z AI API",
			version: "1.0.0",
			description: "API documentation for the AI Workout Generator application",
		},
		servers: [
			{
				url: `http://localhost:3000`,
			},
		],
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "jwt",
				},
			},
			schemas: {
				UserResponse: {
					type: "object",
					properties: {
						id: { type: "integer" },
						email: { type: "string" },
						firstName: { type: "string" },
						lastName: { type: "string" },
						role: { type: "string", enum: ["USER", "ADMIN"] },
						createdAt: { type: "string", format: "date-time" },
					},
				},

				Exercise: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						name: { type: "string", example: "Bench Press" },
						targetMuscle: { type: "string", example: "Chest" },
						equipment: { type: "string", example: "Barbell" },
					},
				},

				LoggedSet: {
					type: "object",
					properties: {
						id: { type: "integer", example: 10 },
						setNumber: { type: "integer", example: 3 },
						weight: { type: "number", example: 80 },
						reps: { type: "integer", example: 10 },
						exerciseId: { type: "integer", example: 1 },
						exercise: {
							$ref: "#/components/schemas/Exercise",
						},
					},
				},

				WorkoutDay: {
					type: "object",
					properties: {
						id: { type: "integer", example: 3 },
						day: { type: "string", example: "Day 1 - Push" },
						exercises: {
							type: "array",
							items: {
								$ref: "#/components/schemas/Exercise",
							},
						},
					},
				},

				WorkoutPlan: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						name: { type: "string", example: "Push-Pull-Legs Plan" },
						userId: { type: "integer", example: 2 },
						createdAt: { type: "string", format: "date-time", example: "2025-11-03T18:00:00Z" },
						workoutDays: {
							type: "array",
							items: {
								$ref: "#/components/schemas/WorkoutDay",
							},
						},
					},
				},

				WorkoutSession: {
					type: "object",
					properties: {
						id: { type: "integer", example: 42 },
						name: { type: "string", example: "Push Day" },
						startTime: { type: "string", format: "date-time", example: "2025-11-03T18:00:00Z" },
						endTime: { type: "string", format: "date-time", example: "2025-11-03T19:00:00Z" },
						userId: { type: "integer", example: 1 },
						loggedSets: {
							type: "array",
							items: {
								$ref: "#/components/schemas/LoggedSet",
							},
						},
					},
				},
				WorkoutSessionInput: {
					type: "object",
					required: ["startTime", "endTime", "loggedSets"],
					properties: {
						name: {
							type: "string",
							example: "Push Day Workout",
						},
						startTime: {
							type: "string",
							format: "date-time",
							example: "2025-11-03T18:00:00Z",
						},
						endTime: {
							type: "string",
							format: "date-time",
							example: "2025-11-03T19:00:00Z",
						},
						workoutDayId: {
							type: "integer",
							example: 1,
							description: "Optional — only for saving predefined workouts",
						},
						loggedSets: {
							type: "array",
							items: {
								type: "object",
								required: ["setNumber", "weight", "reps", "exerciseId"],
								properties: {
									setNumber: { type: "integer", example: 1 },
									weight: { type: "number", example: 60 },
									reps: { type: "integer", example: 10 },
									exerciseId: { type: "integer", example: 5 },
								},
							},
						},
					},
				},
			},
		},
		security: [{ cookieAuth: [] }],
		tags: [
			{
				name: "Authentication",
				description: "Endpoints related to authentication and user account management",
			},
			{
				name: "Workouts",
				description: "Endpoints for generating and retrieving workout plans",
			},
			{
				name: "Admin",
				description: "Endpoints for admin management ",
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

export default swaggerOptions;
