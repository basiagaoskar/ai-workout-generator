import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useWorkoutStore = create((set) => ({
	currentWorkout: null,
	workouts: [],

	currentPage: 1,
	totalPages: 1,
	totalWorkouts: 0,

	isGeneratingWorkout: false,
	isLoadingWorkouts: false,

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
			const res = await axiosInstance.get(`/workout/all?page=${page}&limit=${limit}`);
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
}));
