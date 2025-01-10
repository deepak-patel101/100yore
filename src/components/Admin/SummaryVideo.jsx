import React, { useState, useEffect } from "react";
// import "../Component/css/summaryvideo.css"; // Import CSS file for styling
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import GoBack from "./comps/GoBack";

function SummaryVideo() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/student/videosummary_api.php"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setFeedbackData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateDeptClass = (deptt) => {
    return `dept-${deptt.replace(/\s+/g, "-").toLowerCase()}`;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = feedbackData.filter((video) => {
      return (
        video.id.toString().includes(searchQuery) ||
        video.deptt.toString().includes(searchQuery) ||
        video.sub.toString().includes(searchQuery) ||
        video.topic.toString().includes(searchQuery) ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredVideos(filtered);
  }, [searchQuery, feedbackData]);

  return (
    <div className="container-fluid mt-5">
      <GoBack page={"Summary of Video Availability"} />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by video id,subject,topic or title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-box"
        />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col" className="text-center">
                Video ID
              </th>
              <th scope="col" className="text-center">
                Deptt
              </th>
              <th scope="col" className="text-center">
                Subject
              </th>
              <th scope="col" className="text-center">
                Topic
              </th>
              <th scope="col" className="text-center">
                Video Title
              </th>
              <th scope="col" className="text-center">
                Total views
              </th>
              <th scope="col" className="text-center">
                Total likes
              </th>
              <th scope="col" className="text-center">
                Created By
              </th>
              <th scope="col" className="text-center">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((feedback, index) => (
              <tr key={index} className={generateDeptClass(feedback.deptt)}>
                <td>{feedback.id}</td>
                <td>{feedback.deptt}</td>
                <td>{feedback.sub}</td>
                <td>{feedback.topic}</td>
                <td>{feedback.title}</td>
                <td>{feedback.views}</td>
                <td>{feedback.likes}</td>
                <td>{feedback.created_by}</td>
                <td>{feedback.created_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SummaryVideo;
