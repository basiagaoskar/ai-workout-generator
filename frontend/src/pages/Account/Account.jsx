import React, { useState, useEffect } from "react";
import { User, Mail, Save, Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

import { workoutGeneratorSteps } from "../../data/workoutGeneratorConfig";

function Account() {
	const { authUser, isSavingPrefs, isChangingPass, updateUser, changePassword, deleteAccount } = useAuthStore();
	const { theme, setTheme } = useThemeStore();

	const [activeTab, setActiveTab] = useState("prefs");
	const [prefsData, setPrefsData] = useState({
		goal: "",
		gender: "",
		experience: "",
		equipment: "",
		frequency: "",
		weight: "",
		height: "",
		bestBench: "",
		bestSquat: "",
		bestDeadlift: "",
	});

	const [passData, setPassData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const themes = ["light", "dark", "cupcake", "synthwave", "night", "dracula", "aqua", "garden"];

	useEffect(() => {
		if (authUser) {
			setPrefsData({
				goal: authUser.goal || authUser.fitnessGoal || "",
				gender: authUser.gender || "",
				experience: authUser.experienceLevel || "",
				equipment: authUser.availableEquipment || "",
				frequency: authUser.trainingFrequency || "",
				weight: authUser.weight || "",
				height: authUser.height || "",
				bestBench: authUser.bestBench || "",
				bestSquat: authUser.bestSquat || "",
				bestDeadlift: authUser.bestDeadlift || "",
			});
		}
	}, [authUser]);

	const handlePrefsChange = (e) => {
		const { name, value } = e.target;
		setPrefsData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePassChange = (e) => {
		const { name, value } = e.target;
		setPassData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePrefsSubmit = async (e) => {
		e.preventDefault();
		updateUser(prefsData);
	};

	const handleThemeChange = (e) => {
		const newTheme = e.target.value;
		setTheme(newTheme);
	};

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		if (passData.newPassword !== passData.confirmPassword) {
			toast.error("New passwords do not match!");
			return;
		}
		if (passData.newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			return;
		}

		changePassword(passData);
		setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
	};

	if (!authUser) {
		return null;
	}

	return (
		<div className="container mx-auto min-h-screen">
			<Navbar />
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<h1 className="text-4xl font-bold mb-4">My Account</h1>

				<div className="bg-base-300 shadow-md mb-8">
					<div className="card-body">
						<div className="flex flex-col">
							<div className="flex items-center gap-3 text-base">
								<User className="w-5 h-5 text-primary" />
								<span className="font-medium">Name:</span>
								<span>
									{authUser.firstName} {authUser.lastName}
								</span>
							</div>

							<div className="divider "></div>

							<div className="flex items-center gap-3 text-base">
								<Mail className="w-5 h-5 text-primary" />
								<span className="font-medium">Email:</span>
								<span>{authUser.email}</span>
							</div>
						</div>
					</div>
				</div>

				<div role="tablist" className="tabs tabs-border tabs-lg">
					<a role="tab" className={`tab ${activeTab === "prefs" ? "tab-active" : ""}`} onClick={() => setActiveTab("prefs")}>
						Preferences
					</a>
					<a role="tab" className={`tab ${activeTab === "pass" ? "tab-active" : ""}`} onClick={() => setActiveTab("pass")}>
						Security
					</a>
					<a role="tab" className={`tab ${activeTab === "theme" ? "tab-active" : ""}`} onClick={() => setActiveTab("theme")}>
						Theme
					</a>
				</div>

				<div className="card bg-base-300 shadow-md">
					<div className="card-body">
						{activeTab === "prefs" && (
							<>
								<h2 className="card-title text-2xl mb-4">Fitness Preferences</h2>

								<form onSubmit={handlePrefsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{Object.entries(workoutGeneratorSteps).map(([key, step]) => {
										if (step.options) {
											return (
												<label key={key} className="form-control w-full">
													<div className="label">
														<span className="label-text">{step.title}</span>
													</div>
													<select
														name={key.toLowerCase()}
														value={prefsData[key.toLowerCase()] || ""}
														onChange={handlePrefsChange}
														className="select select-bordered"
													>
														<option value="" disabled>
															Select option
														</option>
														{step.options.map((opt) => (
															<option key={opt.key} value={opt.key}>
																{opt.label}
															</option>
														))}
													</select>
												</label>
											);
										}

										if (step.fields) {
											return (
												<div key={key} className="col-span-1 md:col-span-2 ">
													<h2 className="card-title text-2xl mb-4 mt-5">{step.title}</h2>

													<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
														{step.fields.map((field) => {
															return (
																<label key={field.key} className="form-control w-full">
																	<div className="label">
																		<span className="label-text">{field.label}</span>
																	</div>
																	<input
																		type="number"
																		name={field.key}
																		placeholder="0"
																		className="input input-bordered"
																		value={prefsData[field.key] || ""}
																		onChange={handlePrefsChange}
																	/>
																</label>
															);
														})}
													</div>
												</div>
											);
										}
										return null;
									})}

									<div className="flex justify-start mt-4">
										<button type="submit" className="btn btn-primary btn-wide" disabled={isSavingPrefs}>
											{isSavingPrefs ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
											Save Profile
										</button>
									</div>
								</form>
							</>
						)}

						{activeTab === "pass" && (
							<>
								<h2 className="card-title text-2xl mb-4">Change Password</h2>
								<form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
									<label className="form-control w-full flex flex-col">
										<div className="label">
											<span className="label-text">Current Password</span>
										</div>
										<input
											type="password"
											name="oldPassword"
											placeholder="••••••••"
											value={passData.oldPassword}
											onChange={handlePassChange}
											className="input input-bordered"
											required
										/>
									</label>

									<label className="form-control w-full flex flex-col">
										<div className="label">
											<span className="label-text">New Password</span>
										</div>
										<input
											type="password"
											name="newPassword"
											placeholder="New password (min 8 chars)"
											value={passData.newPassword}
											onChange={handlePassChange}
											className="input input-bordered"
											minLength="8"
											required
										/>
									</label>

									<label className="form-control w-full flex flex-col">
										<div className="label">
											<span className="label-text ">Confirm New Password</span>
										</div>
										<input
											type="password"
											name="confirmPassword"
											placeholder="Confirm new password"
											value={passData.confirmPassword}
											onChange={handlePassChange}
											className="input input-bordered"
											minLength="8"
											required
										/>
									</label>

									<div className="flex justify-start">
										<button type="submit" className="btn btn-primary" disabled={isChangingPass}>
											{isChangingPass ? <Loader2 className="animate-spin" /> : <KeyRound className="w-4 h-4" />}
											Change Password
										</button>
									</div>
								</form>

								<h2 className="card-title text-2xl text-error mt-15">Delete Account</h2>
								<p className="text-sm mb-2">
									This will permanently delete your account and all saved preferences.
									<br /> This action cannot be undone.
								</p>
								<div className="flex justify-start">
									<button type="submit" className="btn btn-error" onClick={() => deleteAccount()}>
										Delete Account
									</button>
								</div>
							</>
						)}

						{activeTab === "theme" && (
							<>
								<h2 className="card-title text-2xl">Fitness Appearance</h2>
								<label className="form-control w-full max-w-sm">
									<div className="label">
										<span className="label-text">Select Theme</span>
									</div>
									<select className="select select-bordered" value={theme} onChange={handleThemeChange} data-choose-theme>
										{themes.map((themeName) => (
											<option key={themeName} value={themeName}>
												{themeName.charAt(0).toUpperCase() + themeName.slice(1)}
											</option>
										))}
									</select>
								</label>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Account;
