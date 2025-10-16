import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Target, Home, Calendar, Mars, Venus } from "lucide-react";

import HomeButton from "../../components/HomeButton";
import SummaryStep from "./Steps/SummaryStep";
import NormalStep from "./Steps/NormalStep";

const steps = ["Goal", "Gender", "Experience", "Equipment", "Frequency", "Summary"];

const stepData = {
	Goal: {
		title: "What is your primary fitness goal?",
		options: [
			{ key: "muscle_gain", label: "Muscle Gain", icon: <Dumbbell /> },
			{ key: "fat_loss", label: "Fat Loss", icon: <Target /> },
			{ key: "endurance", label: "Endurance/Cardio", icon: <Home /> },
			{ key: "flexibility", label: "Flexibility/Mobility", icon: <Calendar /> },
		],
	},
	Gender: {
		title: "What is your gender?",
		options: [
			{ key: "man", label: "Man", icon: <Mars /> },
			{ key: "female", label: "Female", icon: <Venus /> },
		],
	},
	Experience: {
		title: "What is your current fitness level?",
		options: [
			{ key: "beginner", label: "Beginner (0-6 months)" },
			{ key: "intermediate", label: "Intermediate (6-24 months)" },
			{ key: "advanced", label: "Advanced (2+ years)" },
		],
	},
	Equipment: {
		title: "What equipment do you have access to?",
		options: [
			{ key: "full_gym", label: "Full Commercial Gym" },
			{ key: "home_weights", label: "Home Gym (Weights & Bench)" },
			{ key: "bodyweight", label: "Bodyweight Only" },
			{ key: "bands_only", label: "Resistance Bands Only" },
		],
	},
	Frequency: {
		title: "How many days per week can you train?",
		options: [
			{ key: "2_3", label: "2-3 Days" },
			{ key: "4_5", label: "4-5 Days" },
			{ key: "6_7", label: "6-7 Days (Advanced)" },
		],
	},
};

function WorkoutGenerator() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isGenerating, setIsGenerating] = useState(false);

	const [formData, setFormData] = useState({
		Goal: null,
		Gender: null,
		Experience: null,
		Equipment: null,
		Frequency: null,
	});

	const handleBack = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleNext = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleOptionSelect = (step, option) => {
		let newFormData = { ...formData };
		newFormData[step] = option;
		setFormData(newFormData);

		setTimeout(() => {
			handleNext();
		}, 500);
	};

	const handleGenerate = () => {
		setIsGenerating(true);
	};

	const renderStepContent = () => {
		const isLastStep = currentStep === steps.length;
		if (isLastStep) {
			return (
				<>
					<SummaryStep formData={formData} isGenerating={isGenerating} handleGenerate={handleGenerate} stepData={stepData} />
					{isLastStep && (
						<button onClick={handleBack} className="btn btn-outline btn-secondary w-full max-w-4xl mt-12">
							Back to Steps
						</button>
					)}
				</>
			);
		}

		return (
			<>
				<NormalStep
					currentStep={currentStep}
					steps={steps}
					stepData={stepData}
					formData={formData}
					handleOptionSelect={handleOptionSelect}
					handleBack={handleBack}
					handleNext={handleNext}
				/>
			</>
		);
	};

	return (
		<div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center py-10">
			<HomeButton />

			<div className="container mx-auto px-4 max-w-5xl ">
				<div className="flex flex-col items-center justify-center p-5 sm:p-18 bg-base-300 rounded-2xl shadow-xl">
					<progress
						className="progress progress-primary w-50 sm:w-sm mb-15 transition-all duration-500 ease-in-out"
						value={String((currentStep / steps.length) * 100)}
						max="100"
					/>
					<div className="text-center p-8 bg-base-200 rounded-xl">{renderStepContent()}</div>
				</div>
			</div>
		</div>
	);
}

export default WorkoutGenerator;
