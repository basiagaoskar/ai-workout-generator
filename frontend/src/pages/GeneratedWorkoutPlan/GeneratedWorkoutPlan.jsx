import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Navbar from "../../components/Navbar";
import DisplayWorkout from "../../components/DisplayWorkout";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import ReturnButton from "../../components/ReturnButton";

function GeneratedWorkoutPlan() {
	const { id } = useParams();
	const { fetchWorkoutPlanById, generatedWorkoutPlan, isLoadingGeneratedWorkoutPlan } = useWorkoutStore();

	useEffect(() => {
		if (id) {
			fetchWorkoutPlanById(id);
		}
	}, [id, fetchWorkoutPlanById]);

	return (
		<div className="container mx-auto">
			<Navbar />
			<div className="max-w-6xl mx-auto p-4 md:p-8">
				<ReturnButton />

				{isLoadingGeneratedWorkoutPlan && (
					<div className="flex justify-center items-center h-64">
						<Loader2 className="animate-spin w-12 h-12 text-primary" />
					</div>
				)}

				{!isLoadingGeneratedWorkoutPlan && generatedWorkoutPlan && (
					<div className="p-5 sm:p-18 bg-base-300 rounded-2xl shadow-xl">
						<DisplayWorkout workout={generatedWorkoutPlan} />
					</div>
				)}

				{!isLoadingGeneratedWorkoutPlan && !generatedWorkoutPlan && (
					<div className="text-center py-10">
						<p className="text-xl opacity-70">Could not find a workout</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default GeneratedWorkoutPlan;
