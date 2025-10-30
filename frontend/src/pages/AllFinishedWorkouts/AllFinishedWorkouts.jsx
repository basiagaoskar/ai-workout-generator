import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useWorkoutStore } from "../../store/useWorkoutStore";

const AllFinishedWorkouts = () => {
	const { fetchFinishedWorkouts, finishedWorkouts, isLoadingFinishedWorkouts } = useWorkoutStore();

	useEffect(() => {
		fetchFinishedWorkouts();
	}, [fetchFinishedWorkouts]);

	if (isLoadingFinishedWorkouts) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin w-10 h-10 text-primary" />
			</div>
		);
	}

	if (!finishedWorkouts || finishedWorkouts.length === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center text-center">
				<p className="text-2xl text-base-content/70">No finished workouts yet</p>
				<Link to="/home" className="btn btn-primary mt-4">
					Go home
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto min-h-screen">
			<Navbar />
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-3xl font-bold mb-8 flex items-center gap-2">Your Finished Workouts</h1>

				<div className="space-y-4">
					{finishedWorkouts.map((session) => {
						const { id, startTime, endTime, workoutDay } = session;
						const durationMinutes = Math.round((new Date(endTime) - new Date(startTime)) / 60000);
						const planName = workoutDay?.plan?.planName || "Unknown Plan";

						return (
							<div key={id} className="p-5 bg-base-200 rounded-lg border border-base-300 hover:bg-base-300 transition">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
									<div>
										<h2 className="text-lg font-semibold">{workoutDay?.focus || "Workout"}</h2>
										<p className="text-sm text-base-content/70">{planName}</p>
										<p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
											<Calendar className="w-3 h-3" />
											{new Date(startTime).toLocaleString()}
										</p>
									</div>

									<div className="flex flex-col sm:items-end mt-3 sm:mt-0">
										<p className="text-sm text-base-content/70 flex items-center gap-1">
											<Clock className="w-4 h-4" /> {durationMinutes} min
										</p>
										<Link to={`/workout/${id}`} className="btn btn-sm btn-primary mt-2">
											View Details
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default AllFinishedWorkouts;
