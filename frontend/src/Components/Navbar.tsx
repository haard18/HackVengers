import React from 'react';
import "../index.css";
import { useNavigate } from 'react-router-dom';
// import { nav } from 'framer-motion/client';
// import { BackgroundBeams } from "./../Components/ui/background-beams"; // Adjust the import path as necessary

const Navbar = () => {
  const token = localStorage.getItem("token");
const navigate=useNavigate();
  const handleLogout= () => {
    localStorage.removeItem("token");
    navigate('/auth')
  };
  return (
    <>
      <nav className="bg-black p-4 relative overflow-hidden">
        <div className="container mx-auto flex justify-between items-center relative z-10">
          {/* Logo/Brand */}
          <div className="text-green-400 text-2xl font-bold">
            EduLink
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-300 hover:text-green-400 transition duration-300">Home</a>
            <a href="#" className="text-gray-300 hover:text-green-400 transition duration-300">About</a>
            <a href="/sessions" className="text-gray-300 hover:text-green-400 transition duration-300">My Sessions</a>
            <a href="/features" className="text-gray-300 hover:text-green-400 transition duration-300">Get Mentors</a>
          </div>
          
          {/* Login/Signup or Logout */}
          <div className="space-x-4">
            {token ? (
              <button onClick={handleLogout} className="text-gray-300 hover:text-green-400 transition duration-300">Logout</button>
            ) : (
              <>
                <a href="/auth" className="text-gray-300 hover:text-green-400 transition duration-300">Login</a>
                <a href="/auth" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Signup</a>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Uncomment this line if you want to use BackgroundBeams */}
      {/* <BackgroundBeams /> */}
    </>
  );
}

export default Navbar;
