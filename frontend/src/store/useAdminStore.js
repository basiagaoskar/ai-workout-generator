import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
	users: [],
	isLoadingUsers: false,
	isDeletingUser: false,

	fetchUsers: async () => {
		set({ isLoadingUsers: true });
		try {
			const res = await axiosInstance.get("/admin/users");
			set({ users: res.data });
		} catch (error) {
			toast.error(error.response.data.message);
			set({ users: [] });
		} finally {
			set({ isLoadingUsers: false });
		}
	},

	deleteUser: async (userId) => {
		set({ isDeletingUser: true });
		try {
			await axiosInstance.delete(`/admin/users/${userId}`);
			toast.success("User deleted successfully!");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isDeletingUser: false });
		}
	},
}));
