import React from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Menu } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const navbarElements = [
	{ id: 1, title: "My Account", path: "/account" },
	{
		id: 2,
		title: "Workout",
		submenu: [
			{ id: 21, title: "Generate Workout", path: "/generate-workout" },
			{ id: 22, title: "My Workouts", path: "/workouts" },
		],
	},
	{ id: 3, title: "Settings", path: "/settings" },
];

function Navbar() {
	const { logout } = useAuthStore();

	const renderMenuItem = (item) => {
		if (item.submenu) {
			return (
				<li key={item.id} className="font-bold text-xl">
					<details>
						<summary>{item.title}</summary>
						<ul className="p-2 min-w-[230px] bg-base-200 rounded-xl shadow-lg">
							{item.submenu.map((subItem) => (
								<li key={subItem.id} className="text-base">
									<Link to={subItem.path}>{subItem.title}</Link>
								</li>
							))}
						</ul>
					</details>
				</li>
			);
		}

		return (
			<li key={item.id} className="font-bold text-xl">
				<Link to={item.path}>{item.title}</Link>
			</li>
		);
	};

	return (
		<>
			<div className="navbar bg-base-300 shadow-sm rounded-2xl p-6">
				<div className="navbar-start">
					<div className="dropdown">
						<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
							<Menu />
						</div>
						<ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-4 w-52 p-2 shadow">
							{navbarElements.map(renderMenuItem)}
						</ul>
					</div>
					<Link to="/home" className="btn btn-ghost text-xl font-bold">
						<Dumbbell className="h-6 w-6 text-primary" /> Gym Z AI
					</Link>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal space-x-10">{navbarElements.map(renderMenuItem)}</ul>
				</div>
				<div className="navbar-end">
					<button className="btn" onClick={logout}>
						Log out
					</button>
				</div>
			</div>
		</>
	);
}

export default Navbar;
