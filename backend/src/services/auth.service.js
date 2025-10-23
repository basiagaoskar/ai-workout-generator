import bcrypt from "bcrypt";

import { PrismaClient } from "../generated/prisma/client.js";
import { generateToken, clearJwtCookie } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const verifyAuth = async (user) => {
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

export const registerUser = async (userData) => {
	const { firstName, lastName, email, password } = userData;
	if (!firstName || !lastName || !email || !password) {
		throw new Error("All fields are required");
	}

	if (password.length < 6) {
		throw new Error("Password must be at least 6 characters long");
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		throw new Error("User with this email already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await prisma.user.create({
		data: {
			firstName,
			lastName,
			email,
			passwordHash: hashedPassword,
		},
	});

	const token = generateToken(newUser.id);

	const { passwordHash, ...userWithoutPassword } = newUser;

	return {
		createdUser: userWithoutPassword,
		token: token,
	};
};

export const authenticateUser = async (loginData) => {
	const { email, password } = loginData;
	if (!email || !password) {
		throw new Error("Email and password are required");
	}

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("Invalid email or password");
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

	if (!isPasswordValid) {
		throw new Error("Invalid email or password");
	}

	const token = generateToken(user.id);

	const { passwordHash, ...userWithoutPassword } = user;

	return {
		createdUser: userWithoutPassword,
		token: token,
	};
};

export const clearAuthCookie = async (res) => {
	clearJwtCookie(res);
};

export const updateUserService = async (userId, data) => {
	const { goal, gender, experience, equipment, frequency } = data;

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: {
			fitnessGoal: goal || null,
			gender: gender || null,
			experienceLevel: experience || null,
			availableEquipment: equipment || null,
			trainingFrequency: frequency || null,
		},
	});

	const { passwordHash, ...userWithoutPassword } = updatedUser;

	return userWithoutPassword;
};

export const updatePasswordService = async (userId, data) => {
	const { oldPassword, newPassword } = data;

	if (!oldPassword || !newPassword) {
		throw new Error("Old and new passwords are required");
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
	if (!isPasswordValid) {
		throw new Error("Invalid password");
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: { passwordHash: hashedPassword },
	});

	const { passwordHash, ...userWithoutPassword } = updatedUser;

	return userWithoutPassword;
};

export const deleteAccountService = async (userId) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	await prisma.user.delete({
		where: { id: userId },
	});
};
