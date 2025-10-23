import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
	authUser: null,
	isCheckingAuth: true,

	isSigningUp: false,
	isLoggingIn: false,

	isSavingPrefs: false,
	isChangingPass: false,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data, isCheckingAuth: false });
		} catch (error) {
			if (error.response?.status === 401) {
				toast.error(error.response.data?.message);
			}
			set({ authUser: null, isCheckingAuth: false });
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const res = await axiosInstance.post("/auth/signup", data);
			set({ authUser: res.data });
			toast.success("Account created successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success("Logged in successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged out successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	updateUser: async (data) => {
		set({ isSavingPrefs: true });
		try {
			const res = await axiosInstance.post("/auth/update-user", data);
			set({ authUser: res.data });
			toast.success("Information saved successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isSavingPrefs: false });
		}
	},

	changePassword: async (data) => {
		set({ isChangingPass: true });
		try {
			const res = await axiosInstance.post("/auth/update-password", data);
			set({ authUser: res.data });
			toast.success("Password changed successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isChangingPass: false });
		}
	},
}));
