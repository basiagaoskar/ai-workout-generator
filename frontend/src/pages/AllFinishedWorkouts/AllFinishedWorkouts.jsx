import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "../../components/Navbar";
import { useWorkoutStore } from "../../store/useWorkoutStore";

function AllFinishedWorkouts() {
	const { fetchFinishedWorkouts, finishedWorkouts, isLoadingFinishedWorkouts, currentWorkoutPage, totalWorkoutPages, totalWorkoutCount } =
		useWorkoutStore();

	useEffect(() => {
		fetchFinishedWorkouts(currentWorkoutPage);
	}, [fetchFinishedWorkouts, currentWorkoutPage]);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalWorkoutPages) {
			fetchFinishedWorkouts(newPage);
		}
	};

	return (
		<div className="container mx-auto min-h-screen">
			<Navbar />
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-4xl font-bold mb-8">My Finished Workouts</h1>

				{isLoadingFinishedWorkouts ? (
					<div className="flex justify-center items-center h-64">
						<Loader2 className="animate-spin w-12 h-12 text-primary" />
					</div>
				) : finishedWorkouts.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-xl opacity-70 mb-4">You haven’t finished any workouts yet.</p>
						<Link to="/start-workout" className="btn btn-primary">
							Start Your First Workout
						</Link>
					</div>
				) : (
					<>
						<div className="space-y-4">
							{finishedWorkouts.map((workout) => (
								<div key={workout.id} className="card bg-base-200 shadow-md">
									<div className="card-body sm:flex-row justify-between items-center">
										<div>
											<h2 className="card-title text-base sm:text-xl flex items-center gap-2">
												<Dumbbell className="w-5 h-5 text-primary flex-shrink-0" />
												{workout.workoutDay?.plan?.planName || "Unnamed Workout"}
											</h2>
											<p className="text-sm opacity-70 flex items-center gap-1 mt-1">
												<Calendar className="w-4 h-4" />
												Date: {new Date(workout.startTime).toLocaleDateString()}
											</p>
										</div>
										<Link to={`/workout/${workout.id}`} className="btn btn-sm btn-outline btn-primary mt-5 sm:mt-0">
											View Details
										</Link>
									</div>
								</div>
							))}
						</div>

						{totalWorkoutPages > 1 && (
							<div className="join flex justify-center mt-8">
								<button
									className="join-item btn"
									onClick={() => handlePageChange(currentWorkoutPage - 1)}
									disabled={currentWorkoutPage === 1}
									aria-label="Previous page"
								>
									<ChevronLeft />
								</button>
								<button className="join-item btn" aria-label={`Current page ${currentWorkoutPage}`}>
									Page {currentWorkoutPage} of {totalWorkoutPages}
								</button>
								<button
									className="join-item btn"
									onClick={() => handlePageChange(currentWorkoutPage + 1)}
									disabled={currentWorkoutPage === totalWorkoutPages}
									aria-label="Next page"
								>
									<ChevronRight />
								</button>
							</div>
						)}

						<p className="text-center text-sm opacity-70 mt-4">Total workouts: {totalWorkoutCount}</p>
					</>
				)}
			</div>
		</div>
	);
}

export default AllFinishedWorkouts;
