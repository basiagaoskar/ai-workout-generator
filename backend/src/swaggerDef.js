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
		tags: [
			{
				name: "Authentication",
				description: "Endpoints related to authentication and user account management",
			},
			{
				name: "Workouts",
				description: "Endpoints for generating and retrieving workout plans",
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

export default swaggerOptions;
