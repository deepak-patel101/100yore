import React, { useState, useEffect } from "react";
import axios from "axios";

const StarRating = ({ videoId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `https://railwaymcq.com/student/videorating_api.php?videoId=${videoId}`
        );
        const avgRating = parseFloat(response.data.averageRating);
        setAverageRating(isNaN(avgRating) ? null : avgRating);
      } catch (error) {
        console.error("Failed to fetch average rating", error);
      }
    };

    fetchAverageRating();
  }, [videoId]);

  const handleClick = async (value) => {
    setRating(value);
    try {
      await axios.post("https://railwaymcq.com/student/videorating_api.php", {
        videoId,
        rating: value,
      });
      const response = await axios.get(
        `https://railwaymcq.com/student/videorating_api.php?videoId=${videoId}`
      );
      const avgRating = parseFloat(response.data.averageRating);
      setAverageRating(isNaN(avgRating) ? null : avgRating);
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

  return (
    <div>
      <div
        className="star-rating"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <span
              key={index}
              className="star"
              style={{
                color: ratingValue <= (hover || rating) ? "#ff9800" : "gray",
                cursor: "pointer",
              }}
              onClick={() => handleClick(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              &#9733;
            </span>
          );
        })}
      </div>
      {averageRating !== null && !isNaN(averageRating) && (
        <p id="rating-result">Average Rating: {averageRating.toFixed(1)}</p>
      )}
    </div>
  );
};

export default StarRating;
