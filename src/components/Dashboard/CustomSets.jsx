import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import { FaSearch } from "react-icons/fa";
import { MdNearbyError } from "react-icons/md";
import QuestionList from "./QuestionList";
import Loading from "../Loading";

const CustomSets = () => {
  const { departments } = useGlobalContext();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // Handle department change

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedSubject(""); // Reset subject and topic when department changes
    setSelectedTopic("");
  };

  // Handle subject change
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setSelectedTopic(""); // Reset topic when subject changes
  };

  // Handle topic change
  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  // Get subjects for selected department
  const selectedDepartmentData = departments.find(
    (dept) => dept.deptt === selectedDepartment
  );

  const subjects = selectedDepartmentData
    ? Object.entries(selectedDepartmentData.subjects)
    : [];

  // Get topics for selected subject
  const selectedSubjectData = selectedDepartmentData?.subjects[selectedSubject];
  const topics = selectedSubjectData ? selectedSubjectData.topics : [];

  const FetchData = async () => {
    setLoading(true);
    setError(null);

    // Properly encode the SearchKeyWord for URL

    const apiUrl = `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_Qbank_Data_For_CustomSets.php?subcode=${selectedSubject}&topcode=${selectedTopic}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  console.log(loading, data);
  return (
    <div>
      <div className="papaDiv">
        <div className="d-flex justify-content-around row">
          {/* Department Dropdown */}
          <div className="col-12 col-md-4">
            Department
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="" disabled>
                Select a Department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept.deptt}>
                  {dept.deptt}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Dropdown */}
          <div className="col-12 col-md-4">
            Subject
            <select
              className="form-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
              disabled={!selectedDepartment}
            >
              <option value="" disabled>
                Select a Subject
              </option>
              {subjects.map(([subCode, subjectData], index) => (
                <option key={index} value={subCode}>
                  {subjectData.sub}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Dropdown */}
          <div className="col-12 col-md-4">
            Topic
            <select
              className="form-select"
              value={selectedTopic}
              onChange={handleTopicChange}
              disabled={!selectedSubject}
            >
              <option value="" disabled>
                Select a Topic
              </option>
              {topics.map((topic, index) => (
                <option key={index} value={topic.topcode}>
                  {topic.topic}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-end">
          {console.log(selectedTopic, selectedSubject)}
          <button
            className={`btn btn-sm btn-outline-${
              selectedSubject !== "" && selectedTopic !== ""
                ? "success"
                : "dark disabled"
            }`}
            onClick={FetchData}
          >
            {" "}
            <FaSearch /> Fetch Data
          </button>
        </div>
      </div>
      {/* ////////////////////////////////////display questions/////////////////////////// */}
      <div className=" ">
        {loading ? <Loading /> : null}
        {/* {data?.length === 0 ? (
          <h4 style={{ color: "red" }}>
            {" "}
            <MdNearbyError /> No Question Found

          </h4>
        ) : (
          <QuestionList data={data} />
        )} */}
        <QuestionList data={data} />
      </div>
    </div>
  );
};

export default CustomSets;
