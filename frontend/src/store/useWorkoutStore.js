import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useWorkoutStore = create((set) => ({
	currentWorkout: null,

	isGeneratingWorkout: false,

	generateWorkout: async (data) => {
		set({ isGeneratingWorkout: true, currentWorkout: null });
		try {
			const res = await axiosInstance.post("/workout/generate", data);
			toast.success("Workout created successfully!");
			set({ currentWorkout: res.data });
			console.log(res.data);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isGeneratingWorkout: false });
		}
	},
}));
