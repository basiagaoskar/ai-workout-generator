import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Dumbbell, UserCog, TrendingUp, Zap, Clock, Send, CheckCircle } from "lucide-react";

const Start = () => {
	return (
		<div className="min-h-screen bg-base-100 text-base-content">
			<header className="container mx-auto px-4 py-4 sticky top-0 z-50 bg-base-300 shadow-md rounded-2xl">
				<nav className="navbar flex justify-between ">
					<Link to="/" className="btn btn-ghost text-xl font-bold">
						<Dumbbell className="h-6 w-6 text-primary" /> Gym Z AI
					</Link>
					<Link to="/auth/login" className="btn btn-primary">
						Log In
					</Link>
				</nav>
			</header>

			<main className="container mx-auto px-4">
				<section className="hero py-16 lg:py-28">
					<div className="hero-content flex-col lg:flex-row-reverse gap-10">
						<img
							src="/cat.png"
							className="max-w-sm rounded-lg shadow-2xl w-full lg:w-1/2 hidden lg:block"
							alt="Cat working out with a dumbbell"
						/>
						<div className="lg:w-1/2">
							<h1 className="text-5xl lg:text-7xl font-extrabold mb-6 text-balance mt-10 lg:mt-0">
								Generate Your Own Workout in <span className="text-primary">Seconds</span>
							</h1>
							<p className="py-6 text-lg opacity-80">
								Leverage the power of <span className="font-bold">Artificial Intelligence</span> to create a personalized training plan,
								tailored to your goals, available equipment, and fitness level. Stop guessing, start growing.
							</p>
							<Link to="/generate-workout" className="btn btn-primary btn-lg mt-4 shadow-lg shadow-primary/50">
								<Sparkles className="h-6 w-6" /> Start Generating Your Workout
							</Link>
						</div>
					</div>
				</section>

				<section className="py-15">
					<h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="card bg-base-300 p-6 shadow-xl rounded-xl transition duration-300 hover:shadow-2xl hover:scale-[1.03]">
							<UserCog className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-2xl font-semibold mb-3">Hyper-Personalization</h3>
							<p className="opacity-80">
								AI adjusts to your body, experience, and goals, ensuring every set and rep counts towards your success. Say goodbye to
								generic plans.
							</p>
						</div>

						<div className="card bg-base-300 p-6 shadow-xl rounded-xl transition duration-300 hover:shadow-2xl hover:scale-[1.03]">
							<TrendingUp className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-2xl font-semibold mb-3">Maximized Efficiency</h3>
							<p className="opacity-80">
								Our algorithms focus on progressive overload and optimal exercise selection, meaning less time wasted and faster, more
								sustainable results.
							</p>
						</div>

						<div className="card bg-base-300 p-6 shadow-xl rounded-xl transition duration-300 hover:shadow-2xl hover:scale-[1.03]">
							<Zap className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-2xl font-semibold mb-3">Instant Generation</h3>
							<p className="opacity-80">
								Get a complete, professionally structured workout plan in less than 60 seconds. Perfect for busy schedules and spontaneous
								gym visits.
							</p>
						</div>
					</div>
				</section>

				<section className="py-16 lg:py-42">
					<h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
					<div className="steps steps-vertical lg:steps-horizontal w-full">
						<div className="step step-primary">
							<div className="flex flex-col items-center text-center p-4">
								<Clock className="h-8 w-8 mb-2" />
								<p className="font-semibold">Define Your Parameters</p>
								<p className="text-sm opacity-70 mt-1">
									Tell the AI your goal (e.g., gain muscle, lose fat), available time, and equipment.
								</p>
							</div>
						</div>
						<div className="step step-primary">
							<div className="flex flex-col items-center text-center p-4">
								<Send className="h-8 w-8 mb-2" />
								<p className="font-semibold">AI Calculation</p>
								<p className="text-sm opacity-70 mt-1">
									Our generative model processes hundreds of data points to build your optimized routine.
								</p>
							</div>
						</div>
						<div className="step step-primary">
							<div className="flex flex-col items-center text-center p-4">
								<CheckCircle className="h-8 w-8 mb-2" />
								<p className="font-semibold">Start Training</p>
								<p className="text-sm opacity-70 mt-1">
									Receive your complete, structured workout plan instantly and begin your fitness journey.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="footer footer-center p-4 bg-base-300 text-base-content mt-12">
				<aside>
					<p>Copyright © 2025 - All rights reserved by Gym Z AI</p>
				</aside>
			</footer>
		</div>
	);
};

export default Start;
