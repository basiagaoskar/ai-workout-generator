import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "../generated/prisma/client.js";
import { generateToken, clearJwtCookie } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const verifyAuth = async (cookies) => {
	const token = cookies?.jwt;

	if (!token) {
		return null;
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	return {
		user: {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		},
	};
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

	const hashedPassword = await bycrypt.hash(password, 10);

	const newUser = await prisma.user.create({
		data: {
			firstName,
			lastName,
			email,
			passwordHash: hashedPassword,
		},
	});

	const token = generateToken(newUser.id);

	return {
		createdUser: {
			id: newUser.id,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
		},
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

	const isPasswordValid = await bycrypt.compare(password, user.passwordHash);

	if (!isPasswordValid) {
		throw new Error("Invalid email or password");
	}

	const token = generateToken(user.id);

	return {
		loggedInUser: {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		},
		token: token,
	};
};

export const clearAuthCookie = async (res) => {
	clearJwtCookie(res);
};
