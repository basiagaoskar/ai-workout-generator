import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useWorkoutStore = create((set) => ({
	currentWorkout: null,
	workouts: [],

	generatedWorkoutPlan: null,
	selectedWorkoutDay: null,
	isLoadingWorkoutDay: false,

	selectedWorkoutSession: null,
	isLoadingWorkoutSession: false,

	currentPage: 1,
	totalPages: 1,
	totalWorkouts: 0,

	isGeneratingWorkout: false,
	isLoadingWorkouts: false,
	isLoadingGeneratedWorkoutPlan: false,

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

	fetchWorkouts: async (page = 1, limit = 8) => {
		set({ isLoadingWorkouts: true });
		try {
			const res = await axiosInstance.get(`/workout/workout-plan/all?page=${page}&limit=${limit}`);
			const { data, totalPages, currentPage, totalCount } = res.data;
			set({
				workouts: data,
				totalPages: totalPages,
				currentPage: currentPage,
				totalWorkouts: totalCount,
			});
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to fetch workouts.");
			set({ workouts: [], totalPages: 1, currentPage: 1, totalWorkouts: 0 });
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

	fetchFinishedWorkouts: async () => {
		set({ isLoadingFinishedWorkouts: true });
		try {
			const res = await axiosInstance.get("/workout/finished-workout/all");
			set({ finishedWorkouts: res.data });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load finished workouts");
			set({ finishedWorkouts: [] });
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
}));
