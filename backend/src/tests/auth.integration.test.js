import { jest } from "@jest/globals";

process.env.GOOGLE_CLIENT_ID = "test-client";

jest.unstable_mockModule("google-auth-library", () => {
	return {
		OAuth2Client: jest.fn().mockImplementation(() => ({
			verifyIdToken: jest.fn().mockResolvedValue({
				getPayload: () => ({
					email: "google.test.user@example.com",
					given_name: "Google",
					family_name: "User",
					sub: "123456789",
				}),
			}),
		})),
	};
});

const { default: app } = await import("../index.js");
import request from "supertest";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();
const api = request(app);

let userCookie;
let userId;

const testUser = {
	firstName: "AuthTest",
	lastName: "User",
	email: "auth.test.user@example.com",
	password: "Password123",
};

beforeAll(async () => {
	await prisma.user.deleteMany({ where: { email: testUser.email } });
});

afterAll(async () => {
	await prisma.user.deleteMany({ where: { email: testUser.email } });
	await prisma.$disconnect();
});

describe("Auth Integration Tests", () => {
	it("POST /auth/signup: should allow a new user to sign up (201)", async () => {
		const res = await api.post("/auth/signup").send(testUser).expect(201).expect("Content-Type", /json/);

		expect(res.body).toHaveProperty("id");
		expect(res.body.email).toBe(testUser.email);
		userId = res.body.id;

		const cookies = res.headers["set-cookie"];
		userCookie = cookies.find((c) => c.startsWith("jwt="));
	});

	it("POST /auth/signup: should fail to sign up with existing email (400)", async () => {
		await api.post("/auth/signup").send(testUser).expect(400);
	});

	it("GET /auth/check: should check auth status and return user data (200)", async () => {
		const res = await api.get("/auth/check").set("Cookie", userCookie).expect(200).expect("Content-Type", /json/);

		expect(res.body.email).toBe(testUser.email);
		expect(res.body.id).toBe(userId);
	});

	it("POST /auth/login: should log in an existing user (200)", async () => {
		const res = await api
			.post("/auth/login")
			.send({ email: testUser.email, password: testUser.password })
			.expect(200)
			.expect("Content-Type", /json/);

		expect(res.body.email).toBe(testUser.email);
	});

	it("POST /auth/login: should fail to log in with wrong password (400)", async () => {
		await api.post("/auth/login").send({ email: testUser.email, password: "WrongPassword123" }).expect(400);
	});

	it("POST /auth/google: should log in or sign up via Google OAuth (200)", async () => {
		const mockCredential = "fake_google_token_123";

		const res = await api.post("/auth/google").send({ credential: mockCredential }).expect(200).expect("Content-Type", /json/);

		expect(res.body.email).toBe("google.test.user@example.com");
		expect(res.body.firstName).toBe("Google");
		expect(res.body.lastName).toBe("User");

		const cookies = res.headers["set-cookie"];
		expect(cookies).toBeDefined();

		const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
		expect(jwtCookie).toBeDefined();
	});

	it("POST /auth/google: should fail when credential is missing (400)", async () => {
		await api.post("/auth/google").send({}).expect(400);
	});

	it("POST /auth/update-user: should allow user to update their fitness preferences (200)", async () => {
		const newPrefs = {
			goal: "fat_loss",
			gender: "female",
			experience: "beginner",
		};

		const res = await api.post("/auth/update-user").set("Cookie", userCookie).send(newPrefs).expect(200).expect("Content-Type", /json/);

		expect(res.body.fitnessGoal).toBe(newPrefs.goal);
	});

	it("POST /auth/update-password: should allow user to update their password (200)", async () => {
		const newPassword = "NewPassword456";
		await api.post("/auth/update-password").set("Cookie", userCookie).send({ oldPassword: testUser.password, newPassword }).expect(200);

		testUser.password = newPassword;
	});

	it("POST /auth/update-password: should fail to update password with wrong old password (400)", async () => {
		await api
			.post("/auth/update-password")
			.set("Cookie", userCookie)
			.send({ oldPassword: "WrongPassword", newPassword: "AnotherNewPassword" })
			.expect(400);
	});

	it("POST /auth/logout: should log out the user (200) and clear cookie", async () => {
		const res = await api.post("/auth/logout").set("Cookie", userCookie).expect(200);

		const setCookieHeader = res.headers["set-cookie"];
		expect(setCookieHeader).toBeDefined();
		expect(setCookieHeader.some((c) => c.startsWith("jwt=;") && c.includes("Expires=Thu, 01 Jan 1970"))).toBe(true);

		await request(app).get("/auth/check").expect(401);
	});

	it("DELETE /auth/delete-account: should allow user to delete their account (200)", async () => {
		const loginRes = await api.post("/auth/login").send({ email: testUser.email, password: testUser.password });
		const cookies = loginRes.headers["set-cookie"];
		userCookie = cookies.find((c) => c.startsWith("jwt="));

		await api.delete("/auth/delete-account").set("Cookie", userCookie).expect(200);

		await api.post("/auth/login").send({ email: testUser.email, password: testUser.password }).expect(400);
	});
});
