import React from "react";
import { CalendarDays } from "lucide-react";

function DisplayWorkout({ workout }) {
	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="text-center mb-12">
				<h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 flex justify-center items-center gap-3">{workout.planName}</h2>
				<p className="text-base-content/70 text-lg">
					Plan created on <span className="font-semibold">{new Date(workout.createdAt).toLocaleDateString()}</span>
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
				{workout.days.map((day) => (
					<div key={day.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300">
						<div className="card-body">
							<h3 className="card-title text-primary flex flex-col items-center gap-2">
								<div className="flex flex-row gap-1 items-center">
									<CalendarDays className="w-5 h-5" />
									Day {day.dayNumber}:
								</div>
								<span className="text-base-content font-semibold">{day.focus}</span>
							</h3>

							<div className="divider my-2"></div>

							<ul className="space-y-2">
								{day.exercises.map((ex) => (
									<li
										key={ex.id}
										className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-base-100 rounded-lg hover:bg-base-300 transition-colors"
									>
										<span className="font-medium">{ex.exercise.name}</span>
										<span className="text-sm text-base-content/70 sm:ml-2">
											{ex.reps.includes("min") || ex.reps.includes("seconds") ? (
												<> {ex.reps}</>
											) : (
												<>
													{ex.sets} x {ex.reps} reps
												</>
											)}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default DisplayWorkout;
