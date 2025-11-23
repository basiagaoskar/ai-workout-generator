import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { useAuthStore } from "../../store/useAuthStore";

function LoginForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { login, isLoggingIn, authWithGoogle } = useAuthStore();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		login(formData);
	};

	return (
		<>
			<h1 className="text-4xl lg:text-5xl font-bold mb-20 text-center">Log into account</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
				<label className="input validator w-full">
					<Mail className="opacity-50" />
					<input type="email" name="email" placeholder="mail@site.com" required onChange={handleChange} />
				</label>
				<label className="input validator w-full">
					<KeyRound className="opacity-50" />
					<input
						type="password"
						name="password"
						required
						placeholder="Password"
						minLength="8"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
						title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
						onChange={handleChange}
					/>
				</label>
				<p className="validator-hint hidden">
					Must be more than 8 characters, including
					<br />
					At least one number <br />
					At least one lowercase letter <br />
					At least one uppercase letter
				</p>
				<div className="flex flex-wrap items-center text-xs opacity-75 gap-x-1">
					<p>Don't have an account? </p>
					<Link to="/auth/signup" className="underline text-info">
						Sign up
					</Link>
				</div>
				<button type="submit" className="btn btn-outline btn-primary btn-block mt-10" disabled={isLoggingIn}>
					{isLoggingIn ? (
						<>
							<Loader2 className="size-5 animate-spin" /> Loading...
						</>
					) : (
						"Log In"
					)}
				</button>

				<div className="divider opacity-75">Or login with</div>
				<div className="flex flex-col lg:flex-row w-full gap-4 justify-center">
					<div className="w-full lg:w-1/2 flex justify-center">
						<div className="w-full">
							<GoogleLogin
								onSuccess={(credentialResponse) => {
									authWithGoogle(credentialResponse.credential);
								}}
								type="standard"
								theme="outline"
								size="large"
								text="signin_with"
								shape="rectangular"
								width="100%"
							/>
						</div>
					</div>

					<button type="button" className="btn w-full lg:w-1/2 bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800">
						<svg aria-label="Apple logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1195 1195">
							<path
								fill="white"
								d="M1006.933 812.8c-32 153.6-115.2 211.2-147.2 249.6-32 25.6-121.6 25.6-153.6 6.4-38.4-25.6-134.4-25.6-166.4 0-44.8 32-115.2 19.2-128 12.8-256-179.2-352-716.8 12.8-774.4 64-12.8 134.4 32 134.4 32 51.2 25.6 70.4 12.8 115.2-6.4 96-44.8 243.2-44.8 313.6 76.8-147.2 96-153.6 294.4 19.2 403.2zM802.133 64c12.8 70.4-64 224-204.8 230.4-12.8-38.4 32-217.6 204.8-230.4z"
							></path>
						</svg>
						Login with Apple
					</button>
				</div>
			</form>
		</>
	);
}

export default LoginForm;
