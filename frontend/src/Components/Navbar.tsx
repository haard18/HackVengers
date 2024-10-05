import "../index.css";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/auth');
  };

  return (
    <div className="navbar bg-black shadow-lg">
      <nav className="p-4 relative overflow-hidden">
        <div className="container mx-auto flex justify-between items-center relative z-10">
          {/* Logo/Brand */}
          <div className="text-green-400 text-2xl font-bold">
            EduLink
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Home</a>
            <a href="rewards" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Rewards</a>
            <a href="/sessions" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">My Sessions</a>
            <a href="/features" className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">Get Mentors</a>
          </div>
          
          {/* Login/Signup or Logout */}
          <div className="space-x-4">
            {token ? (
              <button 
                onClick={handleLogout} 
                className="bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white transition duration-300 px-4 py-2 rounded-lg">
                Logout
              </button>
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
