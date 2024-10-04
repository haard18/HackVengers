import React from 'react';
import "../index.css";
// import { BackgroundBeams } from "./../Components/ui/background-beams"; // Adjust the import path as necessary

const Navbar = () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Refresh the page to reflect the changes
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
            <a href="#" className="text-gray-300 hover:text-green-400 transition duration-300">Services</a>
            <a href="#" className="text-gray-300 hover:text-green-400 transition duration-300">Contact</a>
          </div>
          
          {/* Login/Signup or Logout */}
          <div className="space-x-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-gray-300 hover:text-green-400 transition duration-300">Logout</button>
            ) : (
              <>
                <a href="#" className="text-gray-300 hover:text-green-400 transition duration-300">Login</a>
                <a href="#" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Signup</a>
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
