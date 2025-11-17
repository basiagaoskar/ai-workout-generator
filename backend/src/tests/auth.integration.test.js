import request from "supertest";
import app from "../index.js";
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
	it("should allow a new user to sign up (POST /auth/signup)", async () => {
		const res = await api.post("/auth/signup").send(testUser).expect(201).expect("Content-Type", /json/);

		expect(res.body).toHaveProperty("id");
		expect(res.body.email).toBe(testUser.email);
		userId = res.body.id;

		const cookies = res.headers["set-cookie"];
		userCookie = cookies.find((c) => c.startsWith("jwt="));
	});

	it("should fail to sign up with existing email", async () => {
		await api.post("/auth/signup").send(testUser).expect(400);
	});

	it("should check auth status and return user data (GET /auth/check)", async () => {
		const res = await api.get("/auth/check").set("Cookie", userCookie).expect(200).expect("Content-Type", /json/);

		expect(res.body.email).toBe(testUser.email);
		expect(res.body.id).toBe(userId);
	});

	it("should log in an existing user (POST /auth/login)", async () => {
		const res = await api
			.post("/auth/login")
			.send({ email: testUser.email, password: testUser.password })
			.expect(200)
			.expect("Content-Type", /json/);

		expect(res.body.email).toBe(testUser.email);
	});

	it("should fail to log in with wrong password", async () => {
		await api.post("/auth/login").send({ email: testUser.email, password: "WrongPassword123" }).expect(400);
	});

	it("should allow user to update their fitness preferences (POST /auth/update-user)", async () => {
		const newPrefs = {
			goal: "fat_loss",
			gender: "female",
			experience: "beginner",
		};

		const res = await api.post("/auth/update-user").set("Cookie", userCookie).send(newPrefs).expect(200).expect("Content-Type", /json/);

		expect(res.body.fitnessGoal).toBe(newPrefs.goal);
	});

	it("should allow user to update their password (POST /auth/update-password)", async () => {
		const newPassword = "NewPassword456";
		await api.post("/auth/update-password").set("Cookie", userCookie).send({ oldPassword: testUser.password, newPassword }).expect(200);

		testUser.password = newPassword;
	});

	it("should fail to update password with wrong old password", async () => {
		await api
			.post("/auth/update-password")
			.set("Cookie", userCookie)
			.send({ oldPassword: "WrongPassword", newPassword: "AnotherNewPassword" })
			.expect(400);
	});

	it("should log out the user (POST /auth/logout)", async () => {
		const res = await api.post("/auth/logout").set("Cookie", userCookie).expect(200);

		const setCookieHeader = res.headers["set-cookie"];
		expect(setCookieHeader).toBeDefined();
		expect(setCookieHeader.some((c) => c.startsWith("jwt=;") && c.includes("Expires=Thu, 01 Jan 1970"))).toBe(true);

		await request(app).get("/auth/check").expect(401);
	});
	it("should allow user to delete their account (DELETE /auth/delete-account)", async () => {
		const loginRes = await api.post("/auth/login").send({ email: testUser.email, password: testUser.password });
		const cookies = loginRes.headers["set-cookie"];
		userCookie = cookies.find((c) => c.startsWith("jwt="));

		await api.delete("/auth/delete-account").set("Cookie", userCookie).expect(200);

		await api.post("/auth/login").send({ email: testUser.email, password: testUser.password }).expect(400);
	});
});
