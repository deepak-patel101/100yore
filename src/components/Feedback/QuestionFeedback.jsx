import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../../Context/UserContext";
import { useGlobalContext } from "../../Context/GlobalContextOne";

const QuestionFeedback = ({ questionData, giveFeedback, setGiveFeedback }) => {
  const { user } = useUserContext();
  const { subject } = useGlobalContext();
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("Mcq"); // Default feedback type
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleFeedback = async () => {
    if (!feedback || /^\s*$/.test(feedback)) {
      alert("Please enter your feedback.");
      return;
    }

    const formData = {
      qcode: questionData.qcode,
      subcode: subject.subjectCode,
      topcode: subject.selectedTopicCode,
      feedback: feedback,
      feedback_type: feedbackType,
      feedback_by: user.id,
      // Add any other columns here
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "https://railwaymcq.com/railwaymcq/RailPariksha/Feedback.php",
        formData
      );
      alert("Feedback Added successfully!");
      setGiveFeedback(!giveFeedback);
      setFeedback("");
    } catch (error) {
      console.error(error);
      alert("Failed to Add Feedback!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-2">
      <textarea
        type="text"
        name="feedback"
        value={feedback}
        onChange={handleChange}
        placeholder="Feel free to enter your feedback about this question......"
        className="form-control"
        rows="2"
        cols="8"
      ></textarea>
      <button
        onClick={handleFeedback}
        className="btn btn-outline-danger"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
};

export default QuestionFeedback;
