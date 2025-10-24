import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

import Navbar from "../../components/Navbar";
import DisplayWorkout from "../../components/DisplayWorkout";
import { useWorkoutStore } from "../../store/useWorkoutStore";

function WorkoutDetails() {
	const { id } = useParams();
	const { fetchWorkoutById, selectedWorkout, isLoadingSelectedWorkout } = useWorkoutStore();

	useEffect(() => {
		if (id) {
			fetchWorkoutById(id);
		}
	}, [id, fetchWorkoutById]);

	return (
		<div className="container mx-auto">
			<Navbar />
			<div className="max-w-6xl mx-auto p-4 md:p-8">
				<Link to="/workouts" className="btn btn-ghost mb-4">
					<ArrowLeft />
					Back to my workouts
				</Link>

				{isLoadingSelectedWorkout && (
					<div className="flex justify-center items-center h-64">
						<Loader2 className="animate-spin w-12 h-12 text-primary" />
					</div>
				)}

				{!isLoadingSelectedWorkout && selectedWorkout && (
					<div className="p-5 sm:p-18 bg-base-300 rounded-2xl shadow-xl">
						<DisplayWorkout workout={selectedWorkout} />
					</div>
				)}

				{!isLoadingSelectedWorkout && !selectedWorkout && (
					<div className="text-center py-10">
						<p className="text-xl opacity-70">Could not find a workout</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default WorkoutDetails;
