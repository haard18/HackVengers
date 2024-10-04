"use client";
// import React from "react";
// import { BackgroundBeams } from "./../Components/ui/background-beams";
import TypingEffect from "./ui/TypingEffect"; // Adjust the import path as necessary

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-black relative flex flex-col items-center justify-center antialiased gap-10">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-green-400 to-green-600 font-sans font-bold">
          Link With EduLink
        </h1>
        <TypingEffect 
          text="Guiding Tomorrow's Stars: Mentorship Made Simple" 
          speed={100} // Adjust speed as needed
        />
        {/* Centered Get Started button */}
        <div className="flex justify-center mt-4">
          <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition duration-300 relative z-10 mt-7">
            Get Started
          </button>
        </div>
      </div>
      {/* Uncomment this line if you want to use BackgroundBeams */}
      {/* <BackgroundBeams /> */}
    </div>
  );
}
