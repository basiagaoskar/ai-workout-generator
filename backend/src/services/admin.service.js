import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const getUsers = async () => {
	try {
		const users = await prisma.user.findMany({
			where: {
				role: "USER",
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				createdAt: true,
			},
		});

		return users;
	} catch (error) {
		res.status(500).json({ message: "Failed to load users" });
	}
};

export const deleteUser = async (user) => {
	const userId = parseInt(user);
	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}

	try {
		await prisma.user.delete({
			where: {
				id: userId,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to delete user" });
	}
};
