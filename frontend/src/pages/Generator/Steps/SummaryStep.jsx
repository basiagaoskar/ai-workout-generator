import React from "react";
import { Loader } from "lucide-react";

function SummaryStep({ formData, isGenerating, handleGenerate, stepData }) {
	const findLabel = (stepKey, optionKey) => {
		if (!optionKey || !stepData[stepKey]) {
			return "Not selected";
		}
		const option = stepData[stepKey].options.find((o) => o.key === optionKey);
		return option ? option.label : "Not selected";
	};

	return (
		<>
			<h2 className="text-3xl font-bold mb-2">Summary & Generation</h2>
			<p className="mb-16 opacity-80">Review your choices and generate your plan!</p>
			<div className="text-left space-y-3 mb-10">
				<p>
					<strong>Goal:</strong> {findLabel("Goal", formData.Goal)}
				</p>
				<p>
					<strong>Gender:</strong> {findLabel("Gender", formData.Gender)}
				</p>
				<p>
					<strong>Experience:</strong> {findLabel("Experience", formData.Experience)}
				</p>
				<p>
					<strong>Equipment:</strong> {findLabel("Equipment", formData.Equipment)}
				</p>
				<p>
					<strong>Frequency:</strong> {findLabel("Frequency", formData.Frequency)}
				</p>
			</div>
			<button
				onClick={handleGenerate}
				className={`btn btn-primary btn-lg w-full ${isGenerating ? "btn-disabled" : ""}`}
				disabled={isGenerating}
			>
				{isGenerating ? (
					<>
						<Loader className="animate-spin" /> Generating...
					</>
				) : (
					"Generate Workout"
				)}
			</button>
		</>
	);
}

export default SummaryStep;
