import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { useAuthStore } from "../../store/useAuthStore";

function SignupForm() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		tos: false,
	});

	const { signup, authWithGoogle, isSigningUp } = useAuthStore();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isFormValid) return;
		signup(formData);
	};

	const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password);

	const isFormValid = formData.firstName.trim() && formData.lastName.trim() && formData.email.trim() && isPasswordValid && formData.tos;

	return (
		<>
			<h1 className="text-4xl lg:text-5xl font-bold mb-20 text-center">Create an account</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
				<div className="flex flex-col sm:flex-row gap-4">
					<input type="text" placeholder="First name" name="firstName" className="input w-full" onChange={handleChange} required />
					<input type="text" placeholder="Last name" name="lastName" className="input w-full" onChange={handleChange} required />
				</div>

				<label className="input validator w-full">
					<Mail className="opacity-50" />
					<input type="email" placeholder="mail@site.com" name="email" onChange={handleChange} required />
				</label>

				<label className="input validator w-full">
					<KeyRound className="opacity-50" />
					<input
						type="password"
						required
						placeholder="Password"
						name="password"
						onChange={handleChange}
						minlength="8"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
					/>
				</label>

				{!isPasswordValid && formData.password.length > 0 && (
					<p className="text-xs text-error">
						Must be at least 8 characters long, include one number, one lowercase, and one uppercase letter.
					</p>
				)}

				<div className="flex flex-wrap items-center text-xs opacity-75 gap-x-1">
					<p>Already have an account?</p>
					<Link to="/auth/login" className="underline text-info">
						Log in
					</Link>
				</div>

				<div className="">
					<input type="checkbox" name="tos" checked={formData.tos} onChange={handleChange} className="checkbox validator" required />
					<p className="inline-block ml-2 text-xs opacity-75">
						I agree to the{" "}
						<Link to="/tos" className="underline text-info">
							Terms of Service
						</Link>
					</p>
				</div>

				<button type="submit" className="btn btn-outline btn-primary btn-block mt-10" disabled={!isFormValid || isSigningUp}>
					{isSigningUp ? (
						<>
							<Loader2 className="size-5 animate-spin" /> Loading...
						</>
					) : (
						"Create account"
					)}
				</button>

				<div className="divider opacity-75">Or register with</div>
				<div className="flex flex-col lg:flex-row w-full gap-4 justify-center">
					<div className="w-full lg:w-1/2 flex justify-center">
						<div className="w-full">
							<GoogleLogin
								onSuccess={(credentialResponse) => {
									authWithGoogle(credentialResponse.credential);
								}}
								text="signup_with"
							/>
						</div>
					</div>

					<button type="button" className="btn w-full lg:w-1/2 bg-black text-white border-black">
						<svg aria-label="Apple logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1195 1195">
							<path
								fill="white"
								d="M1006.933 812.8c-32 153.6-115.2 211.2-147.2 249.6-32 25.6-121.6 25.6-153.6 6.4-38.4-25.6-134.4-25.6-166.4 0-44.8 32-115.2 19.2-128 12.8-256-179.2-352-716.8 12.8-774.4 64-12.8 134.4 32 134.4 32 51.2 25.6 70.4 12.8 115.2-6.4 96-44.8 243.2-44.8 313.6 76.8-147.2 96-153.6 294.4 19.2 403.2zM802.133 64c12.8 70.4-64 224-204.8 230.4-12.8-38.4 32-217.6 204.8-230.4z"
							></path>
						</svg>
						Sign up with Apple
					</button>
				</div>
			</form>
		</>
	);
}

export default SignupForm;
