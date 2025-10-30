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
