import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RatingForm = () => {
  const [fieldRatings, setFieldRatings] = useState([0, 0, 0, 0, 0]);
  const [comment, setComment] = useState("");
  const session = useLocation().state?.sessionId;
  
  console.log("Session ID:", session);
  const navigate = useNavigate();

  // Define questions to be rated
  const questions = [
    "How comfortable was the language of the trainer?",
    "How would you rate your understanding level of the session?",
    "How well did the trainer engage the audience?",
    "How helpful did you find the materials provided?",
    "Overall, how would you rate the session?"
  ];

  const handleRatingChange = (index: number, newRating: number) => {
    const updatedRatings = [...fieldRatings];
    updatedRatings[index] = newRating;
    setFieldRatings(updatedRatings);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const averageRating = fieldRatings.reduce((sum, rating) => sum + rating, 0) / fieldRatings.length;

    try {
      const response = await axios.post('http://localhost:3000/api/trainee/rateSession', {
        sessionId: session,
        comment: comment,
        rating: averageRating,
      }, { headers: { 'auth-token': token }});

      // Check response status
      if (response.status === 200) {
        console.log("Rating submitted successfully:", response.data);
        navigate('/sessions');
      } else {
        console.error("Failed to submit rating:", response.data);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="rating bg-gray-900">
      <div className="max-w-lg mx-auto p-6 bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-green-500">Rate the Session</h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <label className="block text-lg mb-1 text-green-400">{question}</label>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${star <= fieldRatings[index] ? "text-green-500" : "text-gray-400"}`}
                  onClick={() => handleRatingChange(index, star)}
                  onMouseOver={() => handleRatingChange(index, star)}
                  onMouseOut={() => handleRatingChange(index, fieldRatings[index])}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-lg text-green-400">{fieldRatings[index]}</span>
          </div>
        ))}
        <textarea
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-24 p-2 border rounded-lg border-gray-600 bg-gray-800 text-white mt-2 focus:outline-none focus:ring focus:ring-green-300"
        ></textarea>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          Submit Rating
        </button>
        <button
          onClick={()=>{window.alert("Reported Successfully")}}
          className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          Report Session
        </button>
      </div>
    </div>
  );
};

export default RatingForm;
