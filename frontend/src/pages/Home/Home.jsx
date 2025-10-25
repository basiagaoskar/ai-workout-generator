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

			<div className="max-w-6xl mx-auto p-4 md:p-8">
				<div className="hero bg-base-200 rounded-lg">
					<div className="hero-content flex flex-col md:flex-row w-full items-center md:items-start">
						<img src="/wolf.jpg" alt="Wolf picture" className="hidden md:block w-82 rounded-lg shadow-2xl object-cover" />

						<div className="w-full flex flex-col justify-center text-center md:text-left mx-5">
							<h1 className="text-2xl sm:text-4xl font-bold">Welcome back, {authUser?.firstName}!</h1>

							<div className="stats stats-vertical sm:stats-horizontal md:stats-vertical shadow mt-6 bg-base-100 w-full sm:w-auto mx-auto md:mx-0">
								<div className="stat">
									<div className="stat-title">Total Workouts</div>
									<div className="stat-value">{totalWorkouts}</div>
								</div>
								<div className="stat">
									<div className="stat-title">Last workout date</div>
									<div className="stat-value text-primary">
										{recentWorkout ? new Date(recentWorkout.createdAt).toLocaleDateString() : "—"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
					<Link to="/generate-workout" className="card bg-base-200 hover:bg-primary text-primary-content transition-all duration-300">
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
