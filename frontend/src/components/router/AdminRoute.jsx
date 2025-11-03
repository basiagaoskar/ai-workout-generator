import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const AdminRoute = () => {
	const { authUser, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) return <Navigate to="/" replace />;

	if (authUser.role !== "ADMIN") return <Navigate to="/home" replace />;

	return <Outlet />;
};

export default AdminRoute;
