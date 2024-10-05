import { useState } from 'react';
import CustomCard from '../Components/Customcard';
import Navbar from '../Components/Navbar';
import { FiFileText, FiEye, FiDollarSign } from 'react-icons/fi'; // Importing icons
import { FiArrowRight, FiChevronDown } from 'react-icons/fi'; // Importing arrow icon
import axios from 'axios'; // Importing Axios
import { motion } from 'framer-motion'; // Importing Framer Motion

const Rewards = () => {
  const [tokens, setTokens] = useState<number | null>(null); // State to store tokens
  const [error, setError] = useState<string | null>(null); // State to store any error message

  const handleClaimRewards = async () => {
    const authToken = localStorage.getItem('token'); // Assuming you store the token in localStorage
    if (!authToken) {
      setError('No authentication token found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/trainee/getTokens', {}, {
        headers: {
          'auth-token': authToken // Include the auth token in headers
        }
      });

      setTokens(response.data.tokens); // Set tokens from response
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error claiming rewards:", err);
      if (axios.isAxiosError(err)) {
        // If Axios error, get response data
        setError(err.response?.data.error || 'Failed to claim rewards');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // Static rewards data
  const rewards = [
    { name: 'Spotify Premium', tokens: 40, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd_E_Owx2I_1rxnlA4hxQbg8bFCmCZOO2lFA&s' },
    { name: 'Zomato Gold', tokens: 60, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.png/640px-Zomato_logo.png' },
    { name: 'Swiggy Premium', tokens: 60, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ2efvqoQq0H7DZJoUcwQgh3PoFcxEc5ACOg&s' },
    // Add more rewards as needed
  ];

  return (
    <>
      <div className="rewards bg-black h-full">
        <Navbar />

        <div className='flex justify-evenly items-center px-6 mt-8'>
          {/* First Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <CustomCard
              title="Receipt"
              description="This is a description for the receipt functionality."
              glowColor="red"
              functionality="Receipt Tracking"
              icon={FiFileText} // Receipt icon
            />
          </motion.div>

          {/* Arrow between first and second card */}
          <FiArrowRight className="text-white text-5xl mx-4" />

          {/* Second Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <CustomCard
              title="Watching"
              description="This is a description for the watching functionality."
              glowColor="#FFD700"
              functionality="Monitoring Activity"
              icon={FiEye} // Watching icon
            />
          </motion.div>

          {/* Arrow between second and third card */}
          <FiArrowRight className="text-white text-5xl mx-4" />

          {/* Third Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <CustomCard
              title="Earnings"
              description="This is a description for the earnings functionality."
              glowColor="green"
              functionality="Manage Finances"
              icon={FiDollarSign} // Dollar icon
            />
          </motion.div>
        </div>

        {/* Container for Button and Explanation Box */}
        <div className="flex flex-col gap-7 items-center justify-center mt-10">
          <div className='mt-6'>
            <motion.button 
              className='bg-white px-4 py-2 text-black rounded-lg opacity-80 hover:opacity-100 transition duration-300' 
              onClick={handleClaimRewards} // Attach click handler
              initial={{ scale: 0.9 }} // Initial scale
              whileHover={{ scale: 1.05 }} // Scale on hover
              whileTap={{ scale: 0.95 }} // Scale on tap
            >
              Claim My Rewards
            </motion.button>
          </div>

          {/* Down Arrow */}
          <FiChevronDown className="text-white text-3xl mt-2" />

          {/* Explanation Box */}
          <div className="bg-gray-800 text-white text-center p-6 rounded-lg w-80 h-80 flex flex-col justify-center items-center opacity-80">
            <h3 className="text-2xl font-bold mb-2">Reward System</h3>
            <p className="text-gray-400">
              The more sessions you watch, the more rewards you earn! Track your receipts, monitor your activity, and manage your earnings with our system to claim exclusive rewards.
            </p>
          </div>

          {/* Display Tokens or Error Message */}
          {tokens !== null && (
            <div className="text-white mt-4">
              <p>You have claimed {tokens} tokens!</p>
            </div>
          )}
          {error && (
            <div className="text-red-500 mt-4">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Static Rewards Display */}
        <div className="flex flex-wrap justify-center mt-10">
          {rewards.map((reward, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-800 text-white rounded-lg p-4 m-4 flex flex-col items-center opacity-80"
              initial={{ scale: 0 }} // Initial scale for animation
              animate={{ scale: 1 }} // Scale to full size
              transition={{ duration: 0.5, delay: index * 0.1 }} // Delay for staggered effect
            >
              <img src={reward.image} alt={reward.name} className="h-32 w-32 mb-2" /> {/* Image of the reward */}
              <h4 className="text-lg font-bold">{reward.name}</h4>
              <p className="text-gray-400">{reward.tokens} tokens</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rewards;
