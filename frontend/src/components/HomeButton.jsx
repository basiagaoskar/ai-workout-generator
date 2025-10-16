import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

function HomeButton() {
	return (
		<Link to="/" className="absolute top-4 left-4 z-10">
			<button className="btn btn-lg ">
				<ArrowLeft />
				<div className="hidden lg:block">Back to home</div>
				<House className="block lg:hidden ml-2" />
			</button>
		</Link>
	);
}

export default HomeButton;
