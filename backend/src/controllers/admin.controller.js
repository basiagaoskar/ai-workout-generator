import { deleteUser, getUsers } from "../services/admin.service.js";

export const getAllUsers = async (req, res) => {
	try {
		const allUsers = await getUsers();
		res.status(200).json(allUsers);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const removeUser = async (req, res) => {
	const { userId } = req.params;

	try {
		await deleteUser(userId);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
