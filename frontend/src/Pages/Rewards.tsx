// import React from 'react';
import CustomCard from '../Components/Customcard';
import Navbar from '../Components/Navbar';
import { FiFileText, FiEye, FiDollarSign } from 'react-icons/fi'; // Importing icons
import { FiArrowRight, FiChevronDown } from 'react-icons/fi'; // Importing arrow icon

const Rewards = () => {
  return (
    <>
      <div className="rewards bg-black h-full">
        <Navbar />

        <div className='flex justify-evenly items-center px-6 mt-8'>
          {/* First Card */}
          <CustomCard
            title="Receipt"
            description="This is a description for the receipt functionality."
            glowColor="red"
            functionality="Receipt Tracking"
            icon={FiFileText} // Receipt icon
          />

          {/* Arrow between first and second card */}
          <FiArrowRight className="text-white text-5xl mx-4" />

          {/* Second Card */}
          <CustomCard
            title="Watching"
            description="This is a description for the watching functionality."
            glowColor="#FFD700"
            functionality="Monitoring Activity"
            icon={FiEye} // Watching icon
          />

          {/* Arrow between second and third card */}
          <FiArrowRight className="text-white text-5xl mx-4" />

          {/* Third Card */}
          <CustomCard
            title="Earnings"
            description="This is a description for the earnings functionality."
            glowColor="green"
            functionality="Manage Finances"
            icon={FiDollarSign} // Dollar icon
          />
        </div>

        {/* Container for Button and Explanation Box */}
        <div className="flex flex-col gap-7 items-center justify-center mt-10">
          <div className='mt-6'>
            <button className='bg-white px-4 py-2 text-black rounded-lg'>Claim My Rewards</button>
          </div>

          {/* Down Arrow */}
          <FiChevronDown className="text-white text-3xl mt-2" />

          {/* Explanation Box */}
          <div className="bg-gray-800 text-white text-center p-6 rounded-lg w-80 h-80 mb-10 flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold mb-2">Reward System</h3>
            <p className="text-gray-400">
              The more sessions you watch, the more rewards you earn! Track your receipts, monitor your activity, and manage your earnings with our system to claim exclusive rewards.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rewards;
