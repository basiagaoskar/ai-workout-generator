import { verifyAuth, registerUser, authenticateUser, clearAuthCookie, updateUserService } from "../services/auth.service.js";
import { setJwtCookie } from "../utils/jwt.js";

export const checkAuth = async (req, res) => {
	try {
		const user = await verifyAuth(req.user);
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
		const { createdUser, token } = await authenticateUser(req.body);
		setJwtCookie(res, token);
		res.status(200).json(createdUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		clearAuthCookie(res);
		res.status(200).json();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const updatedUser = await updateUserService(req.user.id, req.body);
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
