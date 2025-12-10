import React from "react";

function InputStep({ currentStep, steps, stepData, formData, handleInputChange, handleBack, handleNext }) {
	const currentStepName = steps[currentStep - 1];
	const data = stepData[currentStepName];

	return (
		<>
			<h2 className="text-2xl sm:text-4xl font-bold mb-10 text-center">{data.title}</h2>
			<div className="grid grid-cols-1 gap-5 w-full max-w-2/3 justify-center items-center m-auto">
				{data.fields.map((field) => (
					<div key={field.key} className="card bg-base-300 p-6 shadow-lg flex flex-col rounded-xl">
						<label className="text-sm sm:text-lg font-semibold mb-2 float-left">{field.label}</label>
						<input
							type="number"
							placeholder="0"
							min="1"
							className="input input-bordered w-full text-base"
							value={formData[field.key] || ""}
							onChange={(e) => handleInputChange(field.key, e.target.value)}
						/>
					</div>
				))}
			</div>

			<div className="flex flex-col sm:flex-row gap-5 justify-between w-full max-w-4xl mt-12">
				<button onClick={handleBack} className="btn btn-outline btn-secondary" disabled={currentStep === 1}>
					Back
				</button>

				<button onClick={handleNext} className="btn btn-accent" disabled={data.fields.some((f) => !formData[f.key])}>
					{currentStep + 1 === steps.length ? "Summary" : "Next Step"}
				</button>
			</div>
		</>
	);
}

export default InputStep;
