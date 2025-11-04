export const adminRoute = (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized: User not found" });
		}

		if (req.user.role != "ADMIN") {
			return res.status(403).json({ message: "Forbidden: Administrator access required" });
		}

		return next();
	} catch (error) {
		next(error);
	}
};
