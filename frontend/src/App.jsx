import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import Start from "./pages/Start/Start";
import Auth from "./pages/Auth/Auth";
import LoginForm from "./pages/Auth/LoginForm";
import SignupForm from "./pages/Auth/SignupForm";

import Home from "./pages/Home/Home";
import WorkoutGenerator from "./pages/Generator/WorkoutGenerator";
import Account from "./pages/Account/Account";
import Workouts from "./pages/Workouts/Workouts";

import NotFound from "./pages/ErrorPage/NotFound";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

import RouteGuard from "./components/router/RouteGuard";
import WorkoutDetails from "./pages/WorkoutDetails/WorkoutDetails";

function App() {
	const { checkAuth, isCheckingAuth } = useAuthStore();
	const { theme } = useThemeStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) {
		return (
			<div className="bg-base-200 flex items-center justify-center min-h-screen">
				<Loader2 className="size-10 animate-spin" />
			</div>
		);
	}

	return (
		<>
			<div data-theme={theme}>
				<Routes>
					<Route
						path="/"
						element={
							<RouteGuard mode="guest">
								<Start />
							</RouteGuard>
						}
					/>
					<Route
						path="/auth"
						element={
							<RouteGuard mode="guest">
								<Auth />
							</RouteGuard>
						}
					>
						<Route index element={<LoginForm />} />
						<Route path="login" element={<LoginForm />} />
						<Route path="signup" element={<SignupForm />} />
					</Route>
					<Route
						path="/generate-workout"
						element={
							<RouteGuard mode="protected">
								<WorkoutGenerator />
							</RouteGuard>
						}
					/>
					<Route
						path="/account"
						element={
							<RouteGuard mode="protected">
								<Account />
							</RouteGuard>
						}
					/>
					<Route
						path="/home"
						element={
							<RouteGuard mode="protected">
								<Home />
							</RouteGuard>
						}
					/>
					<Route
						path="/workouts"
						element={
							<RouteGuard mode="protected">
								<Workouts />
							</RouteGuard>
						}
					/>
					<Route
						path="/workout/:id"
						element={
							<RouteGuard mode="protected">
								<WorkoutDetails />
							</RouteGuard>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>

				<Toaster />
			</div>
		</>
	);
}

export default App;
