import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

function Auth() {
	return (
		<>
			<div className="min-h-screen text-primary bg-base-100 flex justify-center items-center">
				<Link to="/" className="absolute top-4 left-4 z-10">
					<button className="btn btn-lg ">
						<ArrowLeft />
						<div className="hidden lg:block">Back to home</div>
						<House className="block lg:hidden ml-2" />
					</button>
				</Link>
				<div className="rounded-xl bg-base-300 w-full max-w-7xl flex flex-col lg:flex-row justify-around m-5 p-7 shadow-2xl">
					<div className=" w-1/2 relative">
						<div className="hidden lg:block w-full h-full">
							<div className="carousel rounded-xl">
								<div id="slide1" className="carousel-item relative w-full ">
									<img src="/cat.png" className="w-full" />
									<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
										<a href="#slide4" className="btn  btn-secondary btn-circle">
											❮
										</a>
										<a href="#slide2" className="btn btn-secondary btn-circle">
											❯
										</a>
									</div>
								</div>
								<div id="slide2" className="carousel-item relative w-full">
									<img src="/cat2.jpg" className="w-full" />
									<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
										<a href="#slide1" className="btn btn-secondary btn-circle">
											❮
										</a>
										<a href="#slide3" className="btn btn-secondary btn-circle">
											❯
										</a>
									</div>
								</div>
								<div id="slide3" className="carousel-item relative w-full">
									<img src="/cat3.jpg" className="w-full" />
									<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
										<a href="#slide2" className="btn btn-secondary btn-circle">
											❮
										</a>
										<a href="#slide4" className="btn btn-secondary btn-circle">
											❯
										</a>
									</div>
								</div>
								<div id="slide4" className="carousel-item relative w-full">
									<img src="/cat4.jpg" className="w-full" />
									<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
										<a href="#slide3" className="btn btn-secondary btn-circle">
											❮
										</a>
										<a href="#slide1" className="btn btn-secondary btn-circle">
											❯
										</a>
									</div>
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
