import { registerUser, authenticateUser } from "../services/auth.service.js";

export const signup = async (req, res) => {
	try {
		const newUserInfo = await registerUser(req.body, res);
		res.status(201).json(newUserInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const loggedInUser = await authenticateUser(req.body, res);
		res.status(200).json(loggedInUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
