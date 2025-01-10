import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUpload from "./Fileupload";
import { FaFileUpload } from "react-icons/fa";
import GoBack from "./comps/GoBack";

const QbankMaster = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subcode: "",
    topcode: "",
    validity: "",
    difficulty: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    reference: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/subMaster_api.php"
      );
      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopcodes = async (subcode) => {
    try {
      const response = await axios.get(
        `https://railwaymcq.com/student/topicMaster_api.php?subcode=${subcode}`
      );
      setTopcodes(response.data);
    } catch (error) {
      console.error(error);
      setTopcodes([]); // Clear topcodes if fetching fails
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "subcode") {
      fetchTopcodes(value); // Fetch topcodes when subcode changes
    }
  };
  const handleInsert = async () => {
    setLoading(true);
    try {
      // Qbank_op_api.php
      await axios.post(
        "https://railwaymcq.com/student/Qbank_op_api.php",
        formData
      );
      setLoading(false);
      setFormData({
        ...formData,
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        reference: "",
      });
      alert("Data inserted successfully!");
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Failed to insert data!");
    }
  };

  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <GoBack page={"Add Q-Bank"} />
      <FileUpload />
      <div className=" papaDiv">
        <h5 className="text-start">
          {" "}
          <FaFileUpload /> Add Mcq{" "}
        </h5>
        <hr />

        <form>
          <div className="row">
            <div className="col col-12 mb-3 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Select Subject
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <select
                className="Subject form-select"
                name="subcode"
                //   value={formData.subcode}
                onChange={handleInputChange}
              >
                <option key="default" value="">
                  Select Subject
                </option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.subcode}>
                    {subject.sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="col col-12 mb-3 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Select Topic
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <select
                className="Subject form-select"
                name="topcode"
                value={formData.topcode}
                onChange={handleInputChange}
              >
                <option value="">Select Topic</option>
                {topcodes.map((topcode) => (
                  <option key={topcode.topcode} value={topcode.topcode}>
                    {topcode.topic}
                  </option>
                ))}
              </select>
            </div>
            <div className="col col-12 mb-3 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Validity
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="validity"
                value={formData.validity}
                onChange={handleInputChange}
                placeholder="Validity"
              />
            </div>

            <div className="col col-12 mb-2 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Select Difficulty
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <select
                className="Subject form-select"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="">Select Difficulty</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
          </div>
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <div className="row">
            <div className="col col-12 mb-12 col-md-12 mb-1">
              {/* //////////////////  QUESTION //////////////////// */}
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter Question
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <textarea
                className="Subject form-control"
                type="text"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Question"
              />
            </div>
          </div>
          <div className="row">
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            <div className="col col-12 mb-3 col-md-3 mb-1">
              {/* ////////////////// SUBJECT OPTION //////////////////// */}
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter option
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="option1"
                value={formData.option1}
                onChange={handleInputChange}
                placeholder="Option 1"
              />
            </div>
            <div className="col col-12 mb-3 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter Option
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="option2"
                value={formData.option2}
                onChange={handleInputChange}
                placeholder="Option 2"
              />
            </div>
            <div className="col col-12 mb-2 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter Option
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="option3"
                value={formData.option3}
                onChange={handleInputChange}
                placeholder="Option 3"
              />
            </div>
            <div className="col col-12 mb-3 col-md-3 mb-1">
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter Option
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="option4"
                value={formData.option4}
                onChange={handleInputChange}
                placeholder="Option 4"
              />
            </div>
          </div>
          <div className="row">
            {/* /////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            <div className="col col-12 mb-4 col-md-4 mb-1">
              {/* ////////////////// ANSWER //////////////////// */}
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter Answer
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                placeholder="Answer"
              />
            </div>
            {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            <div className="col col-12 mb-4 col-md-4 mb-1">
              {" "}
              {/* ////////////////// Reference //////////////////// */}
              <p
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex text-start"
              >
                {" "}
                Enter Reference
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </p>
              <input
                className="Subject form-control"
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Reference"
              />
            </div>{" "}
            <div className="col col-12 mb-4 col-md-4 mb-1"></div>
          </div>

          <button
            className="btn btn-primary save-note-button"
            type="button"
            onClick={handleInsert}
          >
            Upload
          </button>
          {loading ? (
            <div className=" d-flex justify-content-center mt-1">
              {" "}
              <div
                style={{ width: "200px" }}
                className="row progress d-flex justify-content-center"
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="100%"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          ) : null}
          {/* <button type="button" onClick={handleUpdate}>
          Update
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button> */}
        </form>
      </div>
    </div>
  );
};

export default QbankMaster;
