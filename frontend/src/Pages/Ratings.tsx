import React, { useState } from 'react';

const Ratings = () => {
  const [ratings, setRatings] = useState({
    understanding: 0,
    comfort: 0,
    communication: 0,
    punctuality: 0,
    engagement: 0,
    overall: 0,
  });

  const handleRatingChange = (field: string, value: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted ratings:', ratings);
    // Here, you can send the ratings to your backend or handle them as needed.
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h2 className="text-3xl font-semibold mb-6">Rate Your Session</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        {/* Rating field for understanding */}
        <RatingField
          label="Understanding Level of Trainer"
          value={ratings.understanding}
          onChange={(value) => handleRatingChange('understanding', value)}
        />

        {/* Rating field for comfort */}
        <RatingField
          label="Comfort"
          value={ratings.comfort}
          onChange={(value) => handleRatingChange('comfort', value)}
        />

        {/* Rating field for communication */}
        <RatingField
          label="Communication"
          value={ratings.communication}
          onChange={(value) => handleRatingChange('communication', value)}
        />

        {/* Rating field for punctuality */}
        <RatingField
          label="Punctuality"
          value={ratings.punctuality}
          onChange={(value) => handleRatingChange('punctuality', value)}
        />

        {/* Rating field for engagement */}
        <RatingField
          label="Engagement"
          value={ratings.engagement}
          onChange={(value) => handleRatingChange('engagement', value)}
        />

        {/* Rating field for overall */}
        <RatingField
          label="Overall Experience"
          value={ratings.overall}
          onChange={(value) => handleRatingChange('overall', value)}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="mt-6 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

interface RatingFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingField: React.FC<RatingFieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2">{label}</label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
              value === rating ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}
            onClick={() => onChange(rating)}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Ratings;
