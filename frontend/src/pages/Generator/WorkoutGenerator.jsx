import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

import SummaryStep from "./Steps/SummaryStep";
import NormalStep from "./Steps/NormalStep";
import DisplayWorkout from "../../components/DisplayWorkout";

import { useWorkoutStore } from "../../store/useWorkoutStore";
import { useAuthStore } from "../../store/useAuthStore";
import { workoutGeneratorSteps } from "../../data/workoutGeneratorConfig";

const steps = ["Goal", "Gender", "Experience", "Equipment", "Frequency", "Summary"];

function WorkoutGenerator() {
	const { generateWorkout, currentWorkout, isGeneratingWorkout } = useWorkoutStore();
	const { authUser } = useAuthStore();

	const [currentStep, setCurrentStep] = useState(0);

	const [formData, setFormData] = useState({
		Goal: null,
		Gender: null,
		Experience: null,
		Equipment: null,
		Frequency: null,
	});

	const hasUserData =
		authUser?.fitnessGoal && authUser?.gender && authUser?.experienceLevel && authUser?.availableEquipment && authUser?.trainingFrequency;

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(1, prev - 1));
	};

	const handleNext = () => {
		if (currentStep < steps.length) setCurrentStep(currentStep + 1);
	};

	const handleOptionSelect = (step, option) => {
		setFormData((prev) => ({ ...prev, [step]: option }));
		setTimeout(handleNext, 500);
	};

	const handleGenerate = () => {
		generateWorkout(formData);
	};

	const handleUseUserData = () => {
		setFormData({
			Goal: authUser.fitnessGoal,
			Gender: authUser.gender,
			Experience: authUser.experienceLevel,
			Equipment: authUser.availableEquipment,
			Frequency: authUser.trainingFrequency,
		});
		setCurrentStep(steps.length);
	};

	const handleManualMode = () => {
		setCurrentStep(1);
	};

	const renderStepContent = () => {
		const isLastStep = currentStep === steps.length;
		if (isLastStep) {
			return (
				<>
					<SummaryStep
						formData={formData}
						isGenerating={isGeneratingWorkout}
						handleGenerate={handleGenerate}
						stepData={workoutGeneratorSteps}
					/>
					<button onClick={handleBack} className="btn btn-outline btn-secondary w-full max-w-4xl mt-12" disabled={isGeneratingWorkout}>
						Back to Steps
					</button>
				</>
			);
		}

		return (
			<NormalStep
				currentStep={currentStep}
				steps={steps}
				stepData={workoutGeneratorSteps}
				formData={formData}
				handleOptionSelect={handleOptionSelect}
				handleBack={handleBack}
				handleNext={handleNext}
			/>
		);
	};

	return (
		<div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center py-10">
			<Link to="/home" className="absolute top-4 left-4 z-10">
				<button className="btn btn-lg">
					<ArrowLeft />
					<div className="hidden lg:block">Back to home</div>
					<House className="block lg:hidden ml-2" />
				</button>
			</Link>

			<div className="container mx-auto px-4 max-w-5xl">
				<div className="flex flex-col items-center justify-center p-5 sm:p-18 bg-base-300 rounded-2xl shadow-xl">
					{currentWorkout ? (
						<DisplayWorkout workout={currentWorkout} />
					) : currentStep === 0 && hasUserData && !currentWorkout ? (
						<div className="container mx-auto max-w-2xl p-5 rounded-2xl text-center">
							<h2 className="text-2xl font-semibold mb-12">
								We've detected that you already have saved training data. Would you like to use it to generate a plan, or would you prefer
								to enter new data?
							</h2>
							<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
								<button className="btn btn-primary w-full sm:w-1/2" onClick={handleUseUserData}>
									Use my preferences
								</button>
								<button className="btn btn-outline w-full sm:w-1/2" onClick={handleManualMode}>
									Enter manually
								</button>
							</div>
						</div>
					) : (
						<>
							<progress
								className="progress progress-primary w-50 sm:w-sm mb-15 transition-all duration-500 ease-in-out"
								value={String((currentStep / steps.length) * 100)}
								max="100"
							/>
							<div className="text-center p-8 bg-base-200 rounded-xl">{renderStepContent()}</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default WorkoutGenerator;
