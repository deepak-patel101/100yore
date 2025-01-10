import React, { useState, useEffect } from "react";
import axios from "axios";
import "./feedback.css";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import GoBack from "./comps/GoBack";

const AddDept = ({ showAlert }) => {
  const [deptt, setDeptt] = useState("");
  const [depttcode, setDepttcode] = useState("");
  const [subject, setSubject] = useState("");
  const [subcode, setSubcode] = useState("");
  const [topic, setTopic] = useState("");
  const [maxDepttCode, setMaxDepttCode] = useState(0);
  const [maxSubcode, setMaxSubcode] = useState(0);
  const [maxTopcode, setMaxTopcode] = useState(0);
  const [error, setError] = useState("");
  const { departments } = useGlobalContext();
  const [selectedDept, setSelectedDept] = useState(null);
  const [isNewDeptt, setIsNewDeptt] = useState(false);
  const [isNewSubject, setIsNewSubject] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchMaxDepttCode();
    fetchMaxSubcode();
    fetchMaxTopcode();
  }, []);

  useEffect(() => {
    if (depttcode) {
      fetchMaxSubcode();
    }
  }, [depttcode]);

  useEffect(() => {
    if (depttcode && subcode) {
      fetchMaxTopcode();
    }
  }, [depttcode, subcode]);

  const fetchMaxDepttCode = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/railwaymcq/100YoRE/ManageDept_sub_topic_api.php"
      );
      setMaxDepttCode(response.data.max_depttcode || 0);
    } catch (error) {
      console.error("Error fetching max deptt code:", error);
      setMaxDepttCode(0);
    }
  };

  const fetchMaxSubcode = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/railwaymcq/100YoRE/ManageDept_sub_topic_api.php",
        { params: { depttcode } }
      );
      setMaxSubcode(response.data.max_subcode || 0);
    } catch (error) {
      console.error("Error fetching max subcode:", error);
      setMaxSubcode(0);
    }
  };

  const fetchMaxTopcode = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/railwaymcq/100YoRE/ManageDept_sub_topic_api.php",
        { params: { depttcode, subcode } }
      );
      setMaxTopcode(response.data.max_topcode || 0);
    } catch (error) {
      console.error("Error fetching max topcode:", error);
      setMaxTopcode(0);
    }
  };

  const checkDepttAvailability = (depttName) => {
    return departments.some((depttObject) => depttObject.deptt === depttName);
  };

  const checkSubjectAvailability = (subjectName) => {
    if (selectedDept && selectedDept.subjects) {
      return Object.values(selectedDept.subjects).some(
        (sub) => sub.sub === subjectName
      );
    }
    return false;
  };

  const handleDepttChange = (e) => {
    const selectedDeptObj = departments.find(
      (depttObject) => depttObject.depttcode === e.target.value
    );
    setSelectedDept(selectedDeptObj);
    setDeptt(selectedDeptObj.deptt);
    setDepttcode(selectedDeptObj.depttcode);
    setIsNewSubject(false);
    setSubcode("");
    setTopic("");
    setError("");
  };

  const handleSubjectChange = (e) => {
    const selectedSubjectObj = selectedDept.subjects[e.target.value];
    setSelectedSubject(selectedSubjectObj);
    setSubject(selectedSubjectObj.sub);
    setSubcode(e.target.value);
    setTopic("");
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isNewDeptt && checkDepttAvailability(deptt)) {
      setError("Department already exists. Please choose a different name.");
      return;
    }

    if (isNewSubject && checkSubjectAvailability(subject)) {
      setError("Subject already exists. Please choose a different name.");
      return;
    }

    const newDepttCode = isNewDeptt ? Number(maxDepttCode) + 1 : depttcode;
    const newSubcode = isNewSubject ? Number(maxSubcode) + 1 : subcode;
    const newTopcode = Number(maxTopcode) + 1; // Ensure unique topcode

    try {
      await axios.post(
        "https://railwaymcq.com/railwaymcq/100YoRE/ManageDept_sub_topic_api.php",
        {
          deptt,
          depttcode: newDepttCode,
          sub: subject,
          subcode: newSubcode,
          topic,
          topcode: newTopcode, // Use the new unique topcode
        }
      );

      alert("Data Added Successfully", "success");

      if (isNewDeptt) {
        setDepttcode(newDepttCode);
        fetchMaxDepttCode();
      } else if (isNewSubject) {
        fetchMaxSubcode();
      }

      setIsNewDeptt(false);
      setIsNewSubject(false);
      setSelectedDept(selectedDept);
      fetchMaxTopcode(); // Refresh the max topcode after adding a new topic
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred");
    }
  };

  const handleIsNewDepttChange = (e) => {
    setIsNewDeptt(e.target.checked);
    if (!e.target.checked) {
      setError("");
    }
  };

  const handleIsNewSubjectChange = (e) => {
    setIsNewSubject(e.target.checked);
    if (!e.target.checked) {
      setError("");
    }
  };

  const handleDepttInputChange = (e) => {
    const depttName = e.target.value;
    setDeptt(depttName);
    if (isNewDeptt && checkDepttAvailability(depttName)) {
      setError("Department already exists. Please choose a different name.");
    } else {
      setError("");
    }
  };

  const handleSubInputChange = (e) => {
    const subjectName = e.target.value;
    setSubject(subjectName);
    if (isNewSubject && checkSubjectAvailability(subjectName)) {
      setError("Subject already exists. Please choose a different name.");
    } else {
      setError("");
    }
  };
  return (
    <div className="papaDiv container">
      <GoBack page={"Add Department"} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="papaDiv" onSubmit={handleFormSubmit}>
        <h6>Manage Department, Subject, and Topic</h6>

        <div className="">
          <label>
            <input
              className="Subject"
              type="checkbox"
              checked={isNewDeptt}
              onChange={handleIsNewDepttChange}
            />
            &nbsp;Add New Department
          </label>
        </div>
        {isNewDeptt ? (
          <input
            className="form-control Subject"
            type="text"
            name="deptt"
            value={deptt}
            onChange={handleDepttInputChange}
            placeholder="Department Name"
            required={isNewDeptt}
          />
        ) : (
          <div className="">
            <label>Department:</label>
            <select
              className="form-select Subject"
              name="deptt"
              value={depttcode}
              onChange={handleDepttChange}
              required={!isNewDeptt}
            >
              <option value="">Please select Department</option>
              {departments &&
                departments.map((depttObject, index) => (
                  <option key={index} value={depttObject.depttcode}>
                    {depttObject.deptt}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="">
          <label>
            <input
              className="orm-control Subject"
              type="checkbox"
              checked={isNewSubject}
              onChange={handleIsNewSubjectChange}
            />
            &nbsp;Add New Subject
          </label>
        </div>
        {isNewSubject ? (
          <input
            className="form-control Subject"
            type="text"
            name="subject"
            value={subject}
            onChange={handleSubInputChange}
            placeholder="Subject Name"
            required={isNewSubject}
          />
        ) : (
          <div className="">
            <label>Subject:</label>
            <select
              className="form-select Subject"
              name="subject"
              value={subcode}
              onChange={handleSubjectChange}
              disabled={!selectedDept || !selectedDept.subjects}
              required={!isNewDeptt}
            >
              <option value="">Please select Subject</option>
              {selectedDept?.subjects &&
                Object.entries(selectedDept.subjects).map(
                  ([subCode, subDetails], index) => (
                    <option key={index} value={subCode}>
                      {subDetails.sub}
                    </option>
                  )
                )}
            </select>
          </div>
        )}

        <div className="">
          <label>Add topic:(only for verifying purpose)</label>
          <select className="form-select Subject">
            <option value="">Please watch topic before adding..........</option>
            {selectedSubject?.topics &&
              selectedSubject.topics.map((topicObj, index) => (
                <option key={index} value={topicObj.topic}>
                  {topicObj.topic}
                </option>
              ))}
          </select>
        </div>

        <input
          className="form-control Subject"
          type="text"
          name="topic"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Topic Name"
          required
        />
        <button
          className="btn btn-primary save-note-button Subject"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddDept;
