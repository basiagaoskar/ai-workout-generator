import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const GuestRoute = () => {
	const { authUser, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return null;

	if (authUser) return <Navigate to="/home" replace />;

	return <Outlet />;
};

export default GuestRoute;
