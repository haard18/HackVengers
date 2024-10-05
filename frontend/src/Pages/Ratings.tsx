import React, { useState } from "react";

const RatingForm = () => {
  const [fieldRatings, setFieldRatings] = useState([0, 0, 0, 0, 0]);
  const [comment, setComment] = useState("");

  const handleRatingChange = (index: number, newRating: number) => {
    const updatedRatings = [...fieldRatings];
    updatedRatings[index] = newRating;
    setFieldRatings(updatedRatings);
  };

  const handleSubmit = () => {
    const averageRating =
      fieldRatings.reduce((sum, rating) => sum + rating, 0) /
      fieldRatings.length;

    const data = {
      rating: Math.round(averageRating), // Rounded rating
      comment,
    };

    // Send data to the backend via POST request
    console.log("Submitting Rating:", data);
    // e.g., fetch('/api/submitRating', { method: 'POST', body: JSON.stringify(data) })
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
