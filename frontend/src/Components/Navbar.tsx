import "../index.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // Importing Axios
import { FaWallet } from "react-icons/fa";

const Navbar = () => {
  const [balance, setBalance] = useState<number | null>(null); // State to store balance
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const userType = localStorage.getItem("userType"); // Get the userType from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setBalance(null); // Clear balance on logout
    navigate('/auth');
  }

  // Function to check balance
  const checkBalance = useCallback(async () => {
    if (!token || userType !== 'trainee') return; // Return if there's no token or userType is not trainee

    try {
      const response = await axios.get('http://localhost:3000/api/trainee/checkBalance', {
        headers: {
          'auth-token': token // Include the auth token in headers
        }
      });
      setBalance(response.data.balance); // Set balance from response
    } catch (err) {
      console.error("Error checking balance:", err);
      setBalance(null); // Clear balance on error
    }
  }, [token, userType]);

  // useEffect to check balance when the component mounts
  useEffect(() => {
    checkBalance();
  }, [checkBalance]); // Re-run when checkBalance changes

  return (
    <div className="navbar bg-black shadow-lg">
      <nav className="p-4 relative overflow-hidden">
        <div className="container mx-auto flex justify-between items-center relative z-10">
          {/* Logo/Brand */}
          <div className="text-green-400 text-2xl font-bold">
            <a href="/">
              EduLink
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Home</a>
            <a href="/rewards" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Rewards</a>
            <a href="/sessions" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">My Sessions</a>
            <a href="/features" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Get Mentors</a>
          </div>

          {/* Login/Signup or Logout */}
          <div className="space-x-4 flex items-center">
            {token ? (
              <>
                {/* Wallet Icon and Balance Display */}
                <div className="flex items-center text-white">
                  <FaWallet className="text-lg mr-1" /> {/* Wallet icon */}
                  <span>{balance !== null ? `${balance} tokens` : 'Loading...'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/auth" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Login</a>
                <a href="/auth" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">Signup</a>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
