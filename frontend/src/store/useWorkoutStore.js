import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useWorkoutStore = create((set) => ({
	currentWorkout: null,

	generatedWorkoutPlan: null,
	selectedWorkoutDay: null,
	isLoadingWorkoutDay: false,
	isDeletingPlan: false,

	selectedWorkoutSession: null,
	isLoadingWorkoutSession: false,

	workoutPlans: [],
	currentWorkoutPlansPage: 1,
	totalWorkoutPlansPages: 1,
	totalWorkoutPlans: 0,

	finishedWorkouts: [],
	currentWorkoutPage: 1,
	totalWorkoutPages: 1,
	totalWorkoutCount: 0,

	isGeneratingWorkout: false,
	isLoadingWorkouts: false,
	isLoadingGeneratedWorkoutPlan: false,

	allExercises: [],
	isFetchingExercises: false,

	generateWorkout: async (data) => {
		set({ isGeneratingWorkout: true, currentWorkout: null });
		try {
			const res = await axiosInstance.post("/workout/generate", data);
			toast.success("Workout created successfully!");
			set({ currentWorkout: res.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isGeneratingWorkout: false });
		}
	},

	clearCurrentWorkout: () => set({ currentWorkout: null }),

	fetchAllExercises: async () => {
		set({ isFetchingExercises: true });
		try {
			const res = await axiosInstance.get("/workout/exercises/all");
			set({ allExercises: res.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isFetchingExercises: false });
		}
	},

	fetchWorkoutPlans: async (page = 1, limit = 8) => {
		set({ isLoadingWorkouts: true });
		try {
			const res = await axiosInstance.get(`/workout/workout-plan/all?page=${page}&limit=${limit}`);
			const { data, totalWorkoutPlansPages, currentWorkoutPlansPage, totalWorkoutPlans } = res.data;
			set({
				workoutPlans: data,
				totalWorkoutPlansPages: totalWorkoutPlansPages,
				currentWorkoutPlansPage: currentWorkoutPlansPage,
				totalWorkoutPlans: totalWorkoutPlans,
			});
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch workouts.");
			set({ workoutPlans: [], totalWorkoutPlansPages: 1, currentWorkoutPlansPage: 1, totalWorkoutPlans: 0 });
		} finally {
			set({ isLoadingWorkouts: false });
		}
	},

	fetchWorkoutPlanById: async (id) => {
		set({ isLoadingGeneratedWorkoutPlan: true, generatedWorkoutPlan: null });
		try {
			const res = await axiosInstance.get(`/workout/workout-plan/${id}`);
			set({ generatedWorkoutPlan: res.data });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch workout");
		} finally {
			set({ isLoadingGeneratedWorkoutPlan: false });
		}
	},

	fetchWorkoutDayDetails: async (dayId) => {
		set({ isLoadingWorkoutDay: true, selectedWorkoutDay: null });
		try {
			const res = await axiosInstance.get(`/workout/day/${dayId}`);
			set({ selectedWorkoutDay: res.data });
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load workout day");
			set({ selectedWorkoutDay: null });
			return null;
		} finally {
			set({ isLoadingWorkoutDay: false });
		}
	},

	fetchFinishedWorkouts: async (page = 1, limit = 8) => {
		set({ isLoadingFinishedWorkouts: true });
		try {
			const res = await axiosInstance.get(`/workout/finished-workout/all?page=${page}&limit=${limit}`);
			const { data, totalWorkoutPages, currentWorkoutPage, totalWorkoutCount } = res.data;

			set({
				finishedWorkouts: data,
				totalWorkoutPages: totalWorkoutPages,
				currentWorkoutPage: currentWorkoutPage,
				totalWorkoutCount: totalWorkoutCount,
			});
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load finished workouts");
			set({ finishedWorkouts: [], totalWorkoutPages: 1, currentWorkoutPage: 1, totalWorkoutCount: 0 });
		} finally {
			set({ isLoadingFinishedWorkouts: false });
		}
	},

	fetchFinishedWorkoutSessionById: async (id) => {
		set({ isLoadingWorkoutSession: true, selectedWorkoutSession: null });
		try {
			const res = await axiosInstance.get(`/workout/finished-workout/${id}`);
			set({ selectedWorkoutSession: res.data });
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch workout session");
			return null;
		} finally {
			set({ isLoadingWorkoutSession: false });
		}
	},

	saveWorkoutSession: async (data) => {
		try {
			const res = await axiosInstance.post("/workout/save", data);
			toast.success("Workout session saved!");
			return res.data;
		} catch (error) {
			console.error("Save session error:", error);
			toast.error(error.response?.data?.message || "Failed to save workout session");
			return false;
		}
	},

	saveCustomWorkoutSession: async (data) => {
		try {
			const res = await axiosInstance.post("/workout/save-custom", data);
			toast.success("Workout session saved!");
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save freestyle workout session");
			return false;
		}
	},

	deleteWorkoutPlan: async (id) => {
		set({ isDeletingPlan: true });
		try {
			await axiosInstance.delete(`/workout/workout-plan/${id}`);
			toast.success("Workout plan deleted successfully!");

			set((state) => ({
				workoutPlans: state.workoutPlans.filter((plan) => plan.id !== id),
				totalWorkoutPlans: state.totalWorkoutPlans - 1,
			}));
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete workout plan");
		} finally {
			set({ isDeletingPlan: false });
		}
	},
}));
