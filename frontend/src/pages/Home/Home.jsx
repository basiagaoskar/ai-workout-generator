import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ListChecks, Calendar } from "lucide-react";

import Navbar from "../../components/Navbar";
import { useAuthStore } from "../../store/useAuthStore";
import { useWorkoutStore } from "../../store/useWorkoutStore";

const Home = () => {
	const { authUser } = useAuthStore();
	const { fetchWorkouts, totalWorkouts, workouts } = useWorkoutStore();

	useEffect(() => {
		fetchWorkouts(1, 1);
	}, [fetchWorkouts]);

	const recentWorkout = workouts[0];

	return (
		<div className="container mx-auto ">
			<Navbar />

			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-3xl sm:text-4xl font-bold mb-8">Welcome back, {authUser?.firstName}!</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<Link
						to="/generate-workout"
						className="card bg-base-200 hover:bg-primary text-primary-content transition-all duration-300"
					>
						<div className="card-body items-center text-center">
							<Sparkles className="w-12 h-12 mb-2" />
							<h2 className="card-title text-2xl">Generate new workout</h2>
							<p>Create a new plan that perfectly suits you</p>
						</div>
					</Link>
					<Link to="/workouts" className="card bg-base-200 hover:bg-primary transition-all duration-300">
						<div className="card-body items-center text-center">
							<ListChecks className="w-12 h-12 mb-2" />
							<h2 className="card-title text-2xl">My workouts ({totalWorkouts})</h2>
							<p>View your saved training plans</p>
						</div>
					</Link>
				</div>

				{recentWorkout && (
					<>
						<h3 className="text-2xl font-bold mb-4">Last workout:</h3>
						<div className="card bg-base-200 shadow-md">
							<div className="card-body flex-col sm:flex-row justify-between sm:items-center">
								<div>
									<h2 className="card-title text-xl flex items-center gap-2">{recentWorkout.planName}</h2>
									<p className="text-sm opacity-70 flex items-center gap-1 mt-1">
										<Calendar className="w-4 h-4" />
										Utworzono: {new Date(recentWorkout.createdAt).toLocaleDateString()}
									</p>
								</div>
								<Link to={`/workout/${recentWorkout.id}`} className="btn btn-sm btn-outline btn-primary mt-4 sm:mt-0">
									See Details
								</Link>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Home;
