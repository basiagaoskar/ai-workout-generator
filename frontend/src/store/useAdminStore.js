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

	updateRole: async (userId, newRole) => {
		set({ isUpdatingRole: true });
		try {
			await axiosInstance.put(`/admin/users/${userId}`, { newRole });
			toast.success("User role updated successfully!");
			set((state) => ({
				users: state.users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
			}));
		} catch (error) {
			toast.error(error.response.data.message);
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
