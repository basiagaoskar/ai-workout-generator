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
