import bycrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const registerUser = async (userData, res) => {
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

	return { id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email };
};
