import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useWorkoutStore } from "../../store/useWorkoutStore";

const FinishedWorkout = () => {
	const { dayId } = useParams();
	const navigate = useNavigate();
	const { fetchFinishedWorkoutSessionById, selectedWorkoutSession, isLoadingWorkoutSession } = useWorkoutStore();

	useEffect(() => {
		if (dayId) fetchFinishedWorkoutSessionById(dayId);
	}, [dayId, fetchFinishedWorkoutSessionById]);

	if (isLoadingWorkoutSession) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin w-10 h-10 text-primary" />
			</div>
		);
	}

	if (!selectedWorkoutSession) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center text-center">
				<p className="text-2xl text-error font-semibold">Workout session not found</p>
				<button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
					Go Back
				</button>
			</div>
		);
	}

	const { workoutDay, loggedSets, startTime, endTime } = selectedWorkoutSession;

	const groupedByExercise = loggedSets.reduce((acc, set) => {
		const exName = set.exercise?.exercise?.name || "Unknown Exercise";
		if (!acc[exName]) acc[exName] = [];
		acc[exName].push(set);
		return acc;
	}, {});

	const durationMinutes = Math.round((new Date(endTime) - new Date(startTime)) / 60000);

	return (
		<div className="container mx-auto">
			<Navbar />

			<div className="max-w-3xl mx-auto p-2 sm:p-6">
				<Link to="/home" className="btn btn-ghost mb-4 opacity-80">
					<ArrowLeft className="w-5 h-5" /> Home
				</Link>

				<div className="bg-base-300 p-4 sm:p-6 rounded-lg shadow-lg border border-base-200">
					<h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
						<Link to={`/generated-workout-plan/${workoutDay?.id}`}>{workoutDay?.focus || "Workout"}</Link>
					</h1>

					<div className="text-sm text-base-content/70 mb-6 space-y-1">
						<div className="flex items-center">
							<span className="font-semibold mr-1">Started:</span>
							{new Date(startTime).toLocaleString("pl-PL", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
						<span className="font-semibold">Duration:</span> {durationMinutes} min
					</div>

					{Object.entries(groupedByExercise).map(([exerciseName, sets]) => (
						<div key={exerciseName} className="mb-6 p-4 bg-base-200 rounded-lg shadow-sm border border-base-200">
							<h2 className="text-lg font-semibold mb-3">{exerciseName}</h2>
							<table className="table w-full">
								<thead>
									<tr className="text-sm text-base-content/70 text-center">
										<th>Set</th>
										<th>Weight</th>
										<th>Reps</th>
									</tr>
								</thead>
								<tbody>
									{sets.map((s, i) => (
										<tr key={i} className={`text-center ${i % 2 === 0 ? "bg-base-100" : "bg-base-200"}`}>
											<td>{s.setNumber}</td>
											<td>{s.weight}kg</td>
											<td>{s.reps}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FinishedWorkout;
