import React from "react";
import { Link } from "react-router-dom";

function LoginForm() {
	return (
		<>
			<h1 className="text-4xl lg:text-5xl font-bold mb-20 text-center">Log into account</h1>

			<form action="" method="post" className="flex flex-col gap-4 w-full max-w-sm">
				<label className="input validator w-full">
					<svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
							<rect width="20" height="16" x="2" y="4" rx="2"></rect>
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
						</g>
					</svg>
					<input type="email" placeholder="mail@site.com" required />
				</label>
				<label className="input validator w-full">
					<svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
							<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
							<circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
						</g>
					</svg>
					<input
						type="password"
						required
						placeholder="Password"
						minLength="8"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
						title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
					/>
				</label>
				<p className="validator-hint hidden">
					Must be more than 8 characters, including
					<br />
					At least one number <br />
					At least one lowercase letter <br />
					At least one uppercase letter
				</p>
				<div className="flex flex-col sm:flex-row text-xs opacity-75 gap-0.5">
					<p>Don't have an account? </p>
					<Link to="/auth/signup" className="underline text-info">
						Sign up
					</Link>
				</div>
				<button className="btn btn-outline btn-primary btn-block mt-10">Log into account</button>

				<div className="divider opacity-75">Or login with</div>
				<div className="flex flex-col lg:flex-row w-full gap-3 justify-center">
					<button className="btn w-full lg:w-1/2 bg-white text-black border-[#e5e5e5]">
						<svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<g>
								<path d="m0 0H512V512H0" fill="#fff"></path>
								<path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
								<path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
								<path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
								<path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
							</g>
						</svg>
						Google
					</button>

					<button className="btn w-full lg:w-1/2 bg-black text-white border-black">
						<svg aria-label="Apple logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1195 1195">
							<path
								fill="white"
								d="M1006.933 812.8c-32 153.6-115.2 211.2-147.2 249.6-32 25.6-121.6 25.6-153.6 6.4-38.4-25.6-134.4-25.6-166.4 0-44.8 32-115.2 19.2-128 12.8-256-179.2-352-716.8 12.8-774.4 64-12.8 134.4 32 134.4 32 51.2 25.6 70.4 12.8 115.2-6.4 96-44.8 243.2-44.8 313.6 76.8-147.2 96-153.6 294.4 19.2 403.2zM802.133 64c12.8 70.4-64 224-204.8 230.4-12.8-38.4 32-217.6 204.8-230.4z"
							></path>
						</svg>
						Apple
					</button>
				</div>
			</form>
		</>
	);
}

export default LoginForm;
