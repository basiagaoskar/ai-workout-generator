import { verifyAuth, registerUser, authenticateUser } from "../services/auth.service.js";
import { setJwtCookie } from "../utils/jwt.js";

export const checkAuth = async (req, res) => {
	try {
		const user = await verifyAuth(req.cookies);
		res.status(200).json(user);
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
};

export const signup = async (req, res) => {
	try {
		const { createdUser, token } = await registerUser(req.body);
		setJwtCookie(res, token);
		res.status(201).json(createdUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { loggedInUser, token } = await authenticateUser(req.body);
		setJwtCookie(res, token);
		res.status(200).json(loggedInUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
