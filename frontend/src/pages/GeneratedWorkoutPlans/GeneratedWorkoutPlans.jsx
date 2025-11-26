import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Calendar, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import Navbar from "../../components/Navbar";
import { useWorkoutStore } from "../../store/useWorkoutStore";

function GeneratedWorkoutPlans() {
	const {
		fetchWorkoutPlans,
		workoutPlans,
		isLoadingWorkouts,
		currentPage,
		totalPages,
		totalWorkoutPlans,
		deleteWorkoutPlan,
		isDeletingPlan,
	} = useWorkoutStore();

	useEffect(() => {
		fetchWorkoutPlans(currentPage);
	}, [fetchWorkoutPlans, currentPage]);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchWorkoutPlans(newPage);
		}
	};

	const handleDelete = (e, id) => {
		e.preventDefault();
		if (window.confirm("Are you sure you want to delete this plan?")) {
			deleteWorkoutPlan(id);
		}
	};

	return (
		<div className="container mx-auto min-h-screen">
			<Navbar />
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-4xl font-bold mb-8">My Workout Plans</h1>

				{isLoadingWorkouts ? (
					<div className="flex justify-center items-center h-64">
						<Loader2 className="animate-spin w-12 h-12 text-primary" />
					</div>
				) : workoutPlans.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-xl opacity-70 mb-4">You haven't generated any workout plans yet.</p>
						<Link to="/generate-workout" className="btn btn-primary">
							Generate Your First Workout
						</Link>
					</div>
				) : (
					<>
						<div className="space-y-4">
							{workoutPlans.map((plan) => (
								<div key={plan.id} className="card bg-base-200 shadow-md">
									<div className="card-body sm:flex-row justify-between items-center">
										<div>
											<h2 className="card-title text-base sm:text-xl flex items-center gap-2">
												<ListChecks className="w-5 h-5 text-primary flex-shrink-0" />
												{plan.planName}
											</h2>
											<p className="text-sm opacity-70 flex items-center gap-1 mt-1">
												<Calendar className="w-4 h-4" />
												Created: {new Date(plan.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="flex gap-2 mt-5 sm:mt-0">
											<Link to={`/generated-workout-plan/${plan.id}`} className="btn btn-sm btn-outline btn-primary">
												View Details
											</Link>
											<button
												className="btn btn-sm btn-outline btn-error"
												onClick={(e) => handleDelete(e, plan.id)}
												disabled={isDeletingPlan}
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{totalPages > 1 && (
							<div className="join flex justify-center mt-8">
								<button
									className="join-item btn"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									aria-label="Previous page"
								>
									<ChevronLeft />
								</button>
								<button className="join-item btn" aria-label={`Current page ${currentPage}`}>
									Page {currentPage} of {totalPages}
								</button>
								<button
									className="join-item btn"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									aria-label="Next page"
								>
									<ChevronRight />
								</button>
							</div>
						)}
						<p className="text-center text-sm opacity-70 mt-4">Total plans: {totalWorkoutPlans}</p>
					</>
				)}
			</div>
		</div>
	);
}

export default GeneratedWorkoutPlans;
