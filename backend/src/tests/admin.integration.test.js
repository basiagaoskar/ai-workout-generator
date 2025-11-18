import request from "supertest";
import app from "../index.js";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();
const api = request(app);

let adminCookie;
let adminId;
let normalUserId;
let userCookie;

const adminUser = {
	firstName: "Admin",
	lastName: "User",
	email: "admin.test@example.com",
	password: "AdminPassword123",
};

const normalUser = {
	firstName: "Normal",
	lastName: "User",
	email: "normal.test@example.com",
	password: "NormalPassword123",
};

beforeAll(async () => {
	await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, normalUser.email] } } });

	const adminRes = await api.post("/auth/signup").send(adminUser);
	const normalRes = await api.post("/auth/signup").send(normalUser);

	adminId = adminRes.body.id;
	normalUserId = normalRes.body.id;

	await prisma.user.update({
		where: { id: adminId },
		data: { role: "ADMIN" },
	});

	const loginRes = await api.post("/auth/login").send({ email: adminUser.email, password: adminUser.password });
	const cookies = loginRes.headers["set-cookie"];
	adminCookie = cookies.find((c) => c.startsWith("jwt="));

	const userLoginRes = await api.post("/auth/login").send({ email: normalUser.email, password: normalUser.password });
	const userCookies = userLoginRes.headers["set-cookie"];
	userCookie = userCookies.find((c) => c.startsWith("jwt="));
});

afterAll(async () => {
	await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, normalUser.email] } } });
	await prisma.$disconnect();
});

describe("Admin Integration Tests", () => {
	it("GET /admin/users: should forbid access to admin routes for non-admin users", async () => {
		await api.get("/admin/users").set("Cookie", userCookie).expect(403);
	});

	it("GET /admin/users: should allow admin to get all registered users", async () => {
		const res = await api.get("/admin/users").set("Cookie", adminCookie).expect(200).expect("Content-Type", /json/);

		expect(res.body.length).toBeGreaterThanOrEqual(2);
		expect(res.body.some((u) => u.role === "ADMIN" && u.id === adminId)).toBe(true);
		expect(res.body.some((u) => u.role === "USER" && u.id === normalUserId)).toBe(true);
	});

	it("PUT /admin/users/:userId: should allow admin to update a normal user's role to ADMIN", async () => {
		const res = await api
			.put(`/admin/users/${normalUserId}`)
			.set("Cookie", adminCookie)
			.send({ newRole: "ADMIN" })
			.expect(200)
			.expect("Content-Type", /json/);

		expect(res.body.user.id).toBe(normalUserId);
		expect(res.body.user.role).toBe("ADMIN");

		await prisma.user.update({ where: { id: normalUserId }, data: { role: "USER" } });
	});

	it("PUT /admin/users/:userId: should forbid admin from changing another admin's role", async () => {
		await prisma.user.update({ where: { id: normalUserId }, data: { role: "ADMIN" } });

		await api.put(`/admin/users/${normalUserId}`).set("Cookie", adminCookie).send({ newRole: "USER" }).expect(400);

		await prisma.user.update({ where: { id: normalUserId }, data: { role: "USER" } });
	});

	it("PUT /admin/users/:userId: should forbid admin from changing their own role", async () => {
		await api.put(`/admin/users/${adminId}`).set("Cookie", adminCookie).send({ newRole: "USER" }).expect(400);
	});

	it("DELETE /admin/users/:userId: should allow admin to delete a user", async () => {
		await api.delete(`/admin/users/${normalUserId}`).set("Cookie", adminCookie).expect(200);

		const res = await api.get("/admin/users").set("Cookie", adminCookie).expect(200);

		expect(res.body.some((u) => u.id === normalUserId)).toBe(false);
	});
});
