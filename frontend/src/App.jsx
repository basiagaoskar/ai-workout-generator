import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import LoginForm from "./pages/Auth/LoginForm";
import SignupForm from "./pages/Auth/SignupForm";
import WorkoutGenerator from "./pages/Generator/WorkoutGenerator";

import NotFound from "./pages/ErrorPage/NotFound";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth" element={<Auth />}>
					<Route index element={<LoginForm />} />
					<Route path="login" element={<LoginForm />} />
					<Route path="signup" element={<SignupForm />} />
				</Route>
				<Route path="/generate-workout" element={<WorkoutGenerator />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
