import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import ReturnButton from "../../components/ReturnButton";

const CustomWorkout = () => {
	const { saveCustomWorkoutSession, fetchAllExercises, allExercises, isFetchingExercises } = useWorkoutStore();
	const navigate = useNavigate();

	const [workoutExercises, setWorkoutExercises] = useState([]);
	const [loggedSets, setLoggedSets] = useState({});
	const [startTime] = useState(new Date());
	const [isSaving, setIsSaving] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedExerciseId, setSelectedExerciseId] = useState("");

	useEffect(() => {
		if (allExercises.length === 0) {
			fetchAllExercises();
		}
	}, [fetchAllExercises, allExercises.length]);

	const availableExercises = allExercises.filter((fullEx) => {
		return !workoutExercises.some((addedEx) => addedEx.exercise.id === fullEx.id);
	});

	const handleAddSet = (exerciseId) => {
		setLoggedSets((prev) => ({
			...prev,
			[exerciseId]: [
				...(prev[exerciseId] || []),
				{
					setNumber: (prev[exerciseId]?.length || 0) + 1,
					weight: "",
					reps: "",
				},
			],
		}));
	};

	const handleSetChange = (exerciseId, index, field, value) => {
		setLoggedSets((prev) => {
			const updated = [...(prev[exerciseId] || [])];
			updated[index][field] = value;
			return { ...prev, [exerciseId]: updated };
		});
	};

	const handleRemoveSet = (exerciseId, index) => {
		setLoggedSets((prev) => {
			const updated = [...(prev[exerciseId] || [])];
			updated.splice(index, 1);

			if (updated.length === 0) {
				const newLogs = { ...prev };
				delete newLogs[exerciseId];
				return newLogs;
			}

			const renumbered = updated.map((set, i) => ({ ...set, setNumber: i + 1 }));

			return { ...prev, [exerciseId]: renumbered };
		});
	};

	const handleAddExercise = () => {
		const exerciseIdInt = parseInt(selectedExerciseId, 10);
		const exerciseData = availableExercises.find((ex) => ex.id === exerciseIdInt);

		const realExerciseId = exerciseIdInt;

		const newExercise = {
			id: realExerciseId,
			exercise: {
				id: realExerciseId,
				name: exerciseData.name,
				targetMuscle: exerciseData.targetMuscle,
			},
		};

		setWorkoutExercises((prev) => [...prev, newExercise]);

		setLoggedSets((prev) => ({
			...prev,
			[realExerciseId]: [{ setNumber: 1, weight: "", reps: "" }],
		}));

		setIsModalOpen(false);
		setSelectedExerciseId("");
	};

	const handleRemoveExercise = (tempExerciseId) => {
		if (!window.confirm("Are you sure you want to remove this exercise and all its logged sets?")) {
			return;
		}

		setWorkoutExercises((prev) => prev.filter((ex) => ex.id !== tempExerciseId));

		setLoggedSets((prev) => {
			const newLogs = { ...prev };
			delete newLogs[tempExerciseId];
			return newLogs;
		});
	};

	const handleSaveSession = async () => {
		if (workoutExercises.length === 0) {
			toast.error("Add at least one exercise to save the session.");
			return;
		}

		setIsSaving(true);

		const allSets = workoutExercises.flatMap((exercise) => {
			const exerciseLogs = loggedSets[exercise.id] || [];

			return exerciseLogs
				.filter((s) => s.weight !== "" && s.reps !== "" && parseFloat(s.weight) >= 0 && parseInt(s.reps) > 0)
				.map((s) => ({
					setNumber: s.setNumber,
					weight: parseFloat(s.weight),
					reps: parseInt(s.reps, 10),
					exerciseId: exercise.exercise.id,
				}));
		});

		if (allSets.length === 0) {
			toast.error("Log at least one set to finish the workout.");
			setIsSaving(false);
			return;
		}

		const data = {
			startTime: startTime.toISOString(),
			endTime: new Date().toISOString(),
			loggedSets: allSets,
		};

		const savedWorkout = await saveCustomWorkoutSession(data);

		if (savedWorkout) {
			navigate(`/workout/${savedWorkout.id}`);
		} else {
			setIsSaving(false);
		}
	};

	const isReadyToSave =
		workoutExercises.length > 0 &&
		Object.values(loggedSets)
			.flat()
			.some((s) => s.weight !== "" && s.reps !== "" && parseFloat(s.weight) >= 0 && parseInt(s.reps) > 0);

	if (isFetchingExercises) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin w-10 h-10 text-primary" />
			</div>
		);
	}

	if (allExercises.length === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center text-center">
				<p className="text-3xl font-semibold text-error">Could not load exercise list.</p>
				<p className="text-xl opacity-70 mt-4">Check backend connection or if exercise seeding was successful.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto h-screen">
			<Navbar />

			<div className="mx-auto max-w-4xl p-4 md:p-8">
				<ReturnButton />

				<div className="bg-base-300 p-6 rounded-lg">
					<div className="flex justify-between items-center mb-10">
						<h1 className="text-2xl md:text-3xl font-bold text-center flex items-center gap-2">Custom Workout</h1>
						<button className="btn btn-success btn-sm sm:btn-md" onClick={handleSaveSession} disabled={!isReadyToSave || isSaving}>
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

					{workoutExercises.length === 0 && (
						<div className="text-center py-10 opacity-70">
							<p className="text-xl mb-4">Click "Add Exercise" to begin your workout</p>
						</div>
					)}

					{workoutExercises.map((exercise) => (
						<div key={exercise.id} className="p-4 bg-base-100 rounded-lg mb-4 border border-base-200">
							<div className="flex justify-between items-start mb-3">
								<div>
									<h3 className="text-lg font-semibold">{exercise.exercise.name}</h3>
									<p className="text-xs text-base-content/60">Muscle Focus: {exercise.exercise.targetMuscle || "N/A"}</p>
								</div>

								<button className="btn btn-ghost btn-xs text-error" onClick={() => handleRemoveExercise(exercise.id)}>
									<Trash2 size={16} />
								</button>
							</div>

							<ul className="space-y-2">
								<li className="flex text-xs font-medium text-base-content/60 px-1 text-center">
									<span className="w-8">Set</span>
									<span className="flex-1">Weight (kg)</span>
									<span className="flex-1">Reps</span>
									<span className="w-8">Del</span>
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

					<div className="mt-8 text-center border-t border-base-200 pt-6">
						<button
							className="btn btn-primary btn-lg"
							onClick={() => {
								setSelectedExerciseId(""); // Resetowanie wybranego ID przed otwarciem
								setIsModalOpen(true);
							}}
							disabled={isFetchingExercises || availableExercises.length === 0}
						>
							<Plus size={24} /> Add Exercise
						</button>
						{availableExercises.length === 0 && workoutExercises.length > 0 && (
							<p className="text-sm text-base-content/70 mt-2">All exercises have been added.</p>
						)}
						{availableExercises.length === 0 && workoutExercises.length === 0 && (
							<p className="text-sm text-error mt-2">No exercises available to add.</p>
						)}
					</div>
				</div>
			</div>

			<dialog open={isModalOpen} className="modal" onClick={() => setIsModalOpen(false)}>
				<div className="modal-box bg-base-300" onClick={(e) => e.stopPropagation()}>
					<h3 className="font-bold text-lg">Add Custom Exercise</h3>
					<p className="py-2 text-sm opacity-80">Select an exercise to add to your current session</p>

					<select
						className="select select-bordered w-full my-4"
						value={selectedExerciseId}
						onChange={(e) => setSelectedExerciseId(e.target.value)}
						disabled={isFetchingExercises}
					>
						<option value="" disabled>
							{isFetchingExercises ? "Loading exercises..." : "Select an exercise"}
						</option>
						{/* Używamy filtrowanej listy dostępnych ćwiczeń */}
						{availableExercises.map((ex) => (
							<option key={ex.id} value={ex.id}>
								{ex.name} ({ex.targetMuscle})
							</option>
						))}
					</select>

					<div className="modal-action">
						<button className="btn btn-success" onClick={handleAddExercise} disabled={!selectedExerciseId}>
							Add Exercise
						</button>
						<button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
							Cancel
						</button>
					</div>
				</div>
			</dialog>
		</div>
	);
};

export default CustomWorkout;
