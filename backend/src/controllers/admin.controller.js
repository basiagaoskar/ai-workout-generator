import { getUsers } from "../services/admin.service.js";

export const getAllUsers = async (req, res) => {
	try {
		const allUsers = await getUsers();
		res.status(200).json(allUsers);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
