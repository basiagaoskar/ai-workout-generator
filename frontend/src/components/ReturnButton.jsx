import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function ReturnButton() {
	return (
		<Link to={-1} className="btn btn-ghost mb-4 opacity-80">
			<ArrowLeft className="w-5 h-5" /> Return
		</Link>
	);
}

export default ReturnButton;
