import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import HomeButton from "../../components/HomeButton";

function Auth() {
	const totalSlides = 4;
	const [currentSlide, setCurrentSlide] = useState(1);

	useEffect(() => {
		const slideInterval = setInterval(() => {
			setCurrentSlide((prev) => (prev % totalSlides) + 1);
		}, 4000);

		return () => clearInterval(slideInterval);
	}, []);

	useEffect(() => {
		const slideElement = document.getElementById(`slide${currentSlide}`);
		if (slideElement) {
			slideElement.scrollIntoView();
		}
	}, [currentSlide]);

	return (
		<>
			<div className="min-h-screen text-primary bg-base-100 flex justify-center items-center">
				<HomeButton />
				<div className="rounded-xl bg-base-300 w-full max-w-7xl flex flex-col lg:flex-row justify-around m-5 p-7 shadow-2xl">
					<div className=" w-1/2 relative">
						<div className="hidden lg:block w-full h-full">
							<div className="carousel rounded-xl">
								<div id="slide1" className="carousel-item relative w-full ">
									<img src="/cat.png" className="w-full" alt="Cat 1" />
								</div>
								<div id="slide2" className="carousel-item relative w-full">
									<img src="/cat2.jpg" className="w-full" alt="Cat 2" />
								</div>
								<div id="slide3" className="carousel-item relative w-full">
									<img src="/cat3.jpg" className="w-full" alt="Cat 3" />
								</div>
								<div id="slide4" className="carousel-item relative w-full">
									<img src="/cat4.jpg" className="w-full" alt="Cat 4" />
								</div>
							</div>
						</div>
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
