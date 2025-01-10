import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../../Context/UserContext";

const Objection = () => {
  const { user } = useUserContext();
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("objection"); // Default feedback type

  const handleChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleFeedback = async () => {
    if (!feedback || /^\s*$/.test(feedback)) {
      alert("Please enter your feedback.");
      return;
    }

    const formData = {
      feedback: feedback,
      feedback_type: feedbackType,
      feedback_by: user.id,
      // Add any other columns here
    };

    try {
      const response = await axios.post(
        "https://railwaymcq.com/railwaymcq/RailPariksha/Feedback.php",
        formData
      );
      alert("Feedback Added successfully!");
      console.log(response.data);
      setFeedback("");
    } catch (error) {
      console.error(error);
      alert("Failed to Add Feedback!");
    }
  };

  return (
    <div className="container mt-5">
      <textarea
        type="text"
        name="feedback"
        value={feedback}
        onChange={handleChange}
        placeholder="Feel free to enter your feedback about this question......"
        className="form-control"
        id="myBox"
        rows="2"
        col="8"
      ></textarea>
      <button onClick={handleFeedback} className="btn btn-outline-danger">
        Submit Objection
      </button>
    </div>
  );
};

export default Objection;
