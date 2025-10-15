import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

function Auth() {
	return (
		<>
			<div className="min-h-screen text-primary bg-base-100 flex justify-center items-center">
				<Link to="/" className="absolute top-4 left-4 z-10">
					<button className="btn btn-lg ">
						<ArrowLeft />
						<div className="hidden lg:block">Back to home</div>
						<House className="block lg:hidden ml-2" />
					</button>
				</Link>
				<div className="rounded-xl bg-base-300 w-full max-w-7xl flex flex-col lg:flex-row justify-around m-5 p-7 shadow-2xl">
					<div className=" w-1/2 relative">
						<img src="/cat.png" alt="Auth" className="hidden lg:block rounded-xl w-full h-full object-cover" />
					</div>
					<div className="w-full lg:w-1/2 text-base-content flex justify-center items-center flex-col ">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
}

export default Auth;
