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
import GeneratedWorkoutPlans from "./pages/GeneratedWorkoutPlans/GeneratedWorkoutPlans";
import GeneratedWorkoutPlan from "./pages/GeneratedWorkoutPlan/GeneratedWorkoutPlan";
import NewWorkout from "./pages/NewWorkout/NewWorkout";
import AllFinishedWorkouts from "./pages/AllFinishedWorkouts/AllFinishedWorkouts";
import FinishedWorkout from "./pages/FinishedWorkout/FinishedWorkout";

import AdminPanel from "./pages/AdminPanel/AdminPanel";
import NotFound from "./pages/ErrorPage/NotFound";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

import ProtectedRoute from "./components/router/ProtectedRoute";
import GuestRoute from "./components/router/GuestRoute";
import AdminRoute from "./components/router/AdminRoute";

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
					<Route element={<GuestRoute />}>
						<Route path="/" element={<Start />} />
						<Route path="/auth" element={<Auth />}>
							<Route index element={<LoginForm />} />
							<Route path="login" element={<LoginForm />} />
							<Route path="signup" element={<SignupForm />} />
						</Route>
					</Route>

					<Route element={<ProtectedRoute />}>
						<Route path="/home" element={<Home />} />
						<Route path="/account" element={<Account />} />
						<Route path="/generate-workout" element={<WorkoutGenerator />} />
						<Route path="/generated-workout-plans" element={<GeneratedWorkoutPlans />} />
						<Route path="/generated-workout-plan/:id" element={<GeneratedWorkoutPlan />} />
						<Route path="/workout/start/:dayId" element={<NewWorkout />} />
						<Route path="/workouts" element={<AllFinishedWorkouts />} />
						<Route path="/workout/:dayId" element={<FinishedWorkout />} />
					</Route>
					<Route element={<AdminRoute />}>
						<Route path="/admin" element={<AdminPanel />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>

				<Toaster />
			</div>
		</>
	);
}

export default App;
