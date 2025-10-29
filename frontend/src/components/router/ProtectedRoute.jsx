import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = () => {
	const { authUser, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return null;

	if (!authUser) return <Navigate to="/auth/login" replace />;

	return <Outlet />;
};

export default ProtectedRoute;
