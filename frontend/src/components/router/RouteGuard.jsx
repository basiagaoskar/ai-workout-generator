import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const RouteGuard = ({ children, mode }) => {
	const { authUser, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return null;

	if (mode === "protected" && !authUser) return <Navigate to="/auth/login" replace />;
	if (mode === "guest" && authUser) return <Navigate to="/home" replace />;

	return children;
};

export default RouteGuard;
