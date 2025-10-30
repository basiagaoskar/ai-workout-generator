import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, X, CheckCircle2, Loader2 } from "lucide-react";

import Navbar from "../../components/Navbar";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import ReturnButton from "../../components/ReturnButton";

const WorkoutTracker = () => {
	const { dayId } = useParams();
	const navigate = useNavigate();
	const { fetchWorkoutDayDetails, saveWorkoutSession, selectedWorkoutDay, isLoadingWorkoutDay } = useWorkoutStore();

	const [loggedSets, setLoggedSets] = useState({});
	const [startTime, setStartTime] = useState(new Date());
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const loadDay = async () => {
			const data = await fetchWorkoutDayDetails(dayId);
			if (data?.exercises) {
				const initialSets = data.exercises.reduce((acc, ex) => {
					acc[ex.id] = Array.from({ length: ex.sets }, (_, i) => ({
						setNumber: i + 1,
						weight: "",
						reps: "",
					}));
					return acc;
				}, {});
				setLoggedSets(initialSets);
			}
		};
		if (dayId) loadDay();
	}, [dayId, fetchWorkoutDayDetails]);

	const handleAddSet = (exerciseId) => {
		setLoggedSets((prev) => ({
			...prev,
			[exerciseId]: [
				...prev[exerciseId],
				{
					setNumber: prev[exerciseId].length + 1,
					weight: "",
					reps: "",
				},
			],
		}));
	};

	const handleSetChange = (exerciseId, index, field, value) => {
		setLoggedSets((prev) => {
			const updated = [...prev[exerciseId]];
			updated[index][field] = value;
			return { ...prev, [exerciseId]: updated };
		});
	};

	const handleRemoveSet = (exerciseId, index) => {
		setLoggedSets((prev) => {
			const updated = [...prev[exerciseId]];
			updated.splice(index, 1);
			return { ...prev, [exerciseId]: updated };
		});
	};

	const handleSaveSession = async () => {
		if (!selectedWorkoutDay) {
			return;
		}

		setIsSaving(true);

		const allSets = Object.entries(loggedSets).flatMap(([exerciseId, sets]) =>
			sets
				.filter((s) => s.weight !== "" && s.reps !== "" && parseFloat(s.weight) >= 0 && parseInt(s.reps) > 0)
				.map((s) => ({
					setNumber: s.setNumber,
					weight: parseFloat(s.weight),
					reps: parseInt(s.reps, 10),
					exerciseId: parseInt(exerciseId, 10),
				}))
		);

		const data = {
			workoutDayId: selectedWorkoutDay.id,
			startTime: startTime.toISOString(),
			endTime: new Date().toISOString(),
			loggedSets: allSets,
		};

		const savedworkout = await saveWorkoutSession(data);

		if (savedworkout) {
			console.log(savedworkout.id);
			navigate(`/workout/${savedworkout.id}`);
		} else {
			setIsSaving(false);
		}
	};

	const allSetsFilled = Object.values(loggedSets)
		.flat()
		.some((s) => s.weight !== "" && s.reps !== "" && parseFloat(s.weight) >= 0 && parseInt(s.reps) > 0);

	if (isLoadingWorkoutDay) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin w-10 h-10 text-primary" />
			</div>
		);
	}

	if (!selectedWorkoutDay) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center text-center">
				<p className="text-3xl font-semibold text-error">Workout day not found</p>
				<Link to="/home">
					<button className="btn btn-primary mt-4 text-lg">Go Home</button>
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto">
			<Navbar />

			<div className="mx-auto max-w-4xl p-4 md:p-8">
				<ReturnButton />

				<div className="bg-base-300 p-6 rounded-lg">
					<div className="flex justify-between items-center mb-10">
						<h1 className="text-2xl md:text-3xl font-bold text-center">{selectedWorkoutDay.focus}</h1>
						<button className="btn btn-success btn-sm sm:btn-md" onClick={handleSaveSession} disabled={!allSetsFilled || isSaving}>
							{isSaving ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<CheckCircle2 className="w-4 h-4" />
									Finish
								</>
							)}
						</button>
					</div>

					{selectedWorkoutDay.exercises.map((exercise) => (
						<div key={exercise.id} className="p-4 bg-base-100 rounded-lg shadow-md mb-4 border border-base-200">
							<div className="flex justify-between items-start mb-3">
								<div>
									<h3 className="text-lg font-semibold">{exercise.exercise.name}</h3>
									<p className="text-xs text-base-content/60">
										Planned: {exercise.sets} × {exercise.reps}
									</p>
								</div>
							</div>

							<ul className="space-y-2">
								<li className="flex text-xs font-medium text-base-content/60 px-1  text-center">
									<span className="w-8">#</span>
									<span className="flex-8">Weight (kg)</span>
									<span className="flex-8">Reps</span>
									<span className="w-8">Delete</span>
								</li>

								{loggedSets[exercise.id]?.map((set, i) => (
									<li key={i} className="flex items-center gap-2">
										<span className="w-8 text-center text-sm pt-1">{i + 1}.</span>
										<input
											type="number"
											value={set.weight}
											onChange={(e) => handleSetChange(exercise.id, i, "weight", e.target.value)}
											placeholder="kg"
											className="input input-bordered input-sm flex-1 text-center"
											min="0"
											step="0.5"
										/>
										<input
											type="number"
											value={set.reps}
											onChange={(e) => handleSetChange(exercise.id, i, "reps", e.target.value)}
											placeholder="reps"
											className="input input-bordered input-sm flex-1 text-center"
											min="0"
											step="1"
										/>
										<button className="btn btn-ghost btn-xs text-error" onClick={() => handleRemoveSet(exercise.id, i)}>
											<X size={14} />
										</button>
									</li>
								))}
							</ul>

							<button className="btn btn-secondary btn-sm mt-3 w-full md:w-auto" onClick={() => handleAddSet(exercise.id)}>
								<Plus size={16} className="mr-1" /> Add Set
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WorkoutTracker;
