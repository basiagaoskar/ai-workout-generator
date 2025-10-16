import React from "react";

function NormalStep({ currentStep, steps, stepData, formData, handleOptionSelect, handleBack, handleNext }) {
	const currentStepName = steps[currentStep - 1];
	const data = stepData[currentStepName];
	return (
		<>
			<h2 className="text-2xl sm:text-4xl font-bold mb-10 text-center">{data.title}</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-4 gap-6 w-full max-w-4xl">
				{data.options.map((option) => {
					const isSelected = formData[currentStepName] === option.key;

					return (
						<button
							key={option.key}
							onClick={() => handleOptionSelect(currentStepName, option.key)}
							className={`
									card bg-base-300 p-6 text-center shadow-lg transition duration-200 
									${isSelected ? "bg-primary text-primary-content" : "hover:bg-base-300"}
									flex flex-col sm:flex-row items-center justify-center gap-2 h-full
								`}
						>
							<span>{option.icon || ""}</span>
							<p className="text-sm sm:text-lg font-semibold">{option.label}</p>
						</button>
					);
				})}
			</div>
			<div className="flex flex-col sm:flex-row gap-5 justify-between w-full max-w-4xl mt-12">
				{currentStep < steps.length && (
					<button onClick={handleBack} className="btn btn-outline btn-secondary" disabled={currentStep === 1}>
						Back
					</button>
				)}
				<button onClick={handleNext} className="btn btn-accent" disabled={formData[currentStepName] == null}>
					{currentStep + 1 === steps.length ? "Summary" : "Next Step"}
				</button>
			</div>
		</>
	);
}

export default NormalStep;
