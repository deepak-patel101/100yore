import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedBackForAdmin = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 15;

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.post(
        "https://railwaymcq.com/railwaymcq/RailPariksha/Feedback.php",
        {} // Empty object to simulate empty POST body
      );
      setFeedbackData(response.data);
      setFilteredData(response.data);
      const types = [
        "All",
        ...new Set(response.data.map((item) => item.feedback_type)),
      ];
      setFeedbackTypes(types);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const filterByType = (event) => {
    const type = event.target.value;
    if (type === "All") {
      setFilteredData(feedbackData);
    } else {
      const filtered = feedbackData.filter(
        (item) => item.feedback_type === type
      );
      setFilteredData(filtered);
    }
    setSelectedType(type);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate current feedbacks based on pagination
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredData.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / feedbacksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <button onClick={fetchFeedbackData} className="btn btn-outline-info my-3">
        Fetch Feedback Data
      </button>
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedType}
          onChange={filterByType}
        >
          {feedbackTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <table className="table table-hover table-striped">
          <thead>
            <tr className="table-dark">
              <th>Sno</th>
              <th>Feedback</th>
              <th>Feedback Type</th>
              <th>user ID</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedbacks.length > 0 ? (
              currentFeedbacks.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstFeedback + index + 1}</td>
                  <td>{item.feedback}</td>
                  <td>{item.feedback_type}</td>
                  <td>{item.feedback_by}</td>
                  {/* Display other fields as needed */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No feedback data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <button
          onClick={prevPage}
          className="btn btn-outline-info"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={nextPage}
          className="btn btn-outline-info"
          disabled={
            currentPage === Math.ceil(filteredData.length / feedbacksPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedBackForAdmin;
