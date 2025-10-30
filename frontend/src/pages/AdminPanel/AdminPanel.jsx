import React, { useEffect } from "react";
import { Loader2, Trash2, Users } from "lucide-react";

import Navbar from "../../components/Navbar";
import { useAdminStore } from "../../store/useAdminStore";

const AdminPanel = () => {
	const { users, isLoadingUsers, isDeletingUser, fetchUsers, deleteUser } = useAdminStore();

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleDeleteUser = async (userId, userEmail) => {
		const confirmed = window.confirm(`Are you sure you want to delete user: ${userEmail}?`);
		if (!confirmed) return;

		await deleteUser(userId);
		await fetchUsers();
	};

	if (isLoadingUsers) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-base-100">
				<Loader2 className="animate-spin w-10 h-10 text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto min-h-screen">
			<Navbar />
			<div className="max-w-6xl mx-auto p-4 md:p-8">
				<h1 className="text-3xl sm:text-4xl font-bold mb-8">Administrator Panel</h1>

				<div className="bg-base-300 p-6 rounded-lg shadow-lg">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-semibold flex items-center gap-2">
							<Users className="w-6 h-6 text-primary" /> Registered Users
						</h2>
						<p className="text-sm opacity-70">Total users: {users.length}</p>
					</div>

					<div className="overflow-x-auto">
						<table className="table w-full table-zebra">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th>Joined</th>
									<th className="text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user.id}>
										<th>{user.id}</th>
										<td>
											{user.firstName} {user.lastName}
										</td>
										<td>{user.email}</td>
										<td>
											<div className="badge badge-neutral">{user.role}</div>
										</td>
										<td>{new Date(user.createdAt).toLocaleDateString()}</td>
										<td className="text-center">
											<button
												className="btn btn-error btn-xs"
												onClick={() => handleDeleteUser(user.id, user.email)}
												disabled={isDeletingUser}
											>
												{isDeletingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPanel;
