import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const RatingForm = () => {
  const [fieldRatings, setFieldRatings] = useState([0, 0, 0, 0, 0]);
  const [comment, setComment] = useState("");
  const session = useLocation().state?.sessionId;
  console.log("Session ID:", session);
  const handleRatingChange = (index: number, newRating: number) => {
    const updatedRatings = [...fieldRatings];
    updatedRatings[index] = newRating;
    setFieldRatings(updatedRatings);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const averageRating =
        fieldRatings.reduce((sum, rating) => sum + rating, 0) / fieldRatings.length;

    try {
        const response = await axios.post('http://localhost:3000/api/trainee/rateSession', {
            sessionId: session,
            comment: comment,
            rating: averageRating,
        }, { headers: { 'auth-token': token }});

        // Check response status
        if (response.status === 200) {
            console.log("Rating submitted successfully:", response.data);
        } else {
            console.error("Failed to submit rating:", response.data);
        }
    } catch (error) {
        console.error("Error submitting rating:",error);
    }
};


  return (
    <div>
      <h2>Rate the Session</h2>
      {fieldRatings.map((rating, index) => (
        <div key={index}>
          <label>Field {index + 1}:</label>
          <input
            type="range"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => handleRatingChange(index, Number(e.target.value))}
          />
          <span>{rating}</span>
        </div>
      ))}
      <textarea
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit Rating</button>
    </div>
  );
};

export default RatingForm;
