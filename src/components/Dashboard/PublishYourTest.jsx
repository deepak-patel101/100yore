import React, { useState } from "react";
import { MdPublish } from "react-icons/md";

const PublishYourTest = ({ data }) => {
  // State for form inputs
  const [setName, setSetName] = useState("");
  const [exam, setExam] = useState("");
  const [customExam, setCustomExam] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  // Predefined categories and topics
  const exams = ["Government", "School", "College", "Entrance"];

  const categoriesByExam = {
    Government: [
      "SSC CGL",
      "SSC MTS",
      "SSC CHSL",
      "RRB NTPC",
      "RRB Group D",
      "Railway",
    ],
    School: ["Class 10", "Class 12", "High School Exams"],
    College: ["Semester Exams", "Degree Exams"],
    Entrance: ["JEE", "NEET", "CAT"],
  };

  const topicsByCategory = {
    Government: ["Mix", "Math", "Reasoning", "English"],
    School: ["Science", "Mathematics", "History"],
    College: ["Subject 1", "Subject 2", "Subject 3"],
    Entrance: ["Physics", "Chemistry", "Math", "Biology"],
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for custom category/topic input or default selection
    const selectedExam = customExam || exam;
    const selectedCategory = customCategory || category;
    const selectedTopic = customTopic || topic;
    const qData = data.map((item) => item.qcode);

    // Create an object to store the values
    const formData = {
      setName,
      exam: selectedExam,
      category: selectedCategory,
      topic: selectedTopic,
      questions: qData,
    };

    // Do something with the formData (like sending it to an API)

    // Reset form after submission (optional)
    setSetName("");
    setExam("");
    setCustomExam("");
    setCategory("");
    setCustomCategory("");
    setTopic("");
    setCustomTopic("");
  };

  return (
    <div className="publish-your-test-form">
      <div className="papaDiv">
        <h5>
          <MdPublish /> Publish Your Test
        </h5>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Set Name Input */}
          <div className="form-group">
            <label htmlFor="setName">Set Name:</label>
            <input
              type="text"
              id="setName"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              required
              placeholder="Enter set name"
            />
          </div>
          <div className="row">
            <div className="col-md-4">
              {/* Exam Selection */}
              <div className="form-group">
                <label htmlFor="exam">Exam:</label>
                <select
                  id="exam"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  disabled={customExam !== ""}
                >
                  <option value="">Select Exam</option>
                  {exams.map((exm, index) => (
                    <option key={index} value={exm}>
                      {exm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Exam Input */}
              <div className="form-group">
                <label htmlFor="customExam">Or create a custom exam:</label>
                <input
                  type="text"
                  id="customExam"
                  value={customExam}
                  onChange={(e) => setCustomExam(e.target.value)}
                  placeholder="Enter custom Exam"
                  disabled={exam !== ""}
                />
              </div>
            </div>

            <div className="col-md-4">
              {/* Category Selection */}
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={customCategory !== "" || exam === ""}
                >
                  <option value="">Select Category</option>
                  {exam &&
                    categoriesByExam[exam] &&
                    categoriesByExam[exam].map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              {/* Custom Category Input */}
              <div className="form-group">
                <label htmlFor="customCategory">
                  Or create a custom category:
                </label>
                <input
                  type="text"
                  id="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  disabled={category !== "" || exam === ""}
                />
              </div>
            </div>

            <div className="col-md-4">
              {/* Topic Selection */}
              <div className="form-group">
                <label htmlFor="topic">Topic:</label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={customTopic !== "" || category === ""}
                >
                  <option value="">Select Topic</option>
                  {category &&
                    topicsByCategory[exam] &&
                    topicsByCategory[exam].map((top, index) => (
                      <option key={index} value={top}>
                        {top}
                      </option>
                    ))}
                </select>
              </div>

              {/* Custom Topic Input */}
              <div className="form-group">
                <label htmlFor="customTopic">Or create a custom topic:</label>
                <input
                  type="text"
                  id="customTopic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter custom topic"
                  disabled={topic !== "" || category === ""}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit">Publish</button>
        </form>
      </div>
    </div>
  );
};

export default PublishYourTest;
