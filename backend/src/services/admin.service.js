import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const getUsers = async () => {
	try {
		const users = await prisma.user.findMany({
			orderBy: { id: "asc" },
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

export const updateUserRole = async (userId, newRole, currentAdminId) => {
	if (parseInt(userId) === parseInt(currentAdminId)) {
		throw new Error("You can't change your own role");
	}

	const validRoles = ["USER", "ADMIN"];
	if (!validRoles.includes(newRole)) {
		throw new Error("Invalid role");
	}

	const user = await prisma.user.findUnique({
		where: { id: parseInt(userId, 10) },
		select: { id: true, role: true },
	});

	if (!user) {
		throw new Error("Failed to load user");
	}

	if (user.role === "ADMIN") {
		throw new Error("You cannot change the role of another admin");
	}

	const updatedUser = await prisma.user.update({
		where: { id: parseInt(userId, 10) },
		data: { role: newRole },
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			role: true,
			createdAt: true,
		},
	});

	return updatedUser;
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
