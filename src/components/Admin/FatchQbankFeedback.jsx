import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../Component/css/EditableQbankData.css";
import { useNavigate } from "react-router-dom";
import GoBack from "./comps/GoBack";
import Loading from "../Loading";
// import AdminPage from "./AdminPage";

const FatchQbankFeedback = () => {
  const [qbankData, setQbankData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topcodes, setTopcodes] = useState([]);
  const [formData, setFormData] = useState({
    qcode: "",
    subcode: "",
    topcode: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    reference: "",
    flagUser: true,
  });
  const [editingIndex, setEditingIndex] = useState(null); // State variable to track the index of the row being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [qbankPerPage] = useState(10); // Number of qbank items per page
  const navigate = useNavigate();
  useEffect(() => {
    fetchSubjects();
    fetchData();
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
      setTopcodes([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      let url;
      if (formData.subcode && formData.topcode) {
        url = `https://railwaymcq.com/student/quiz_feedback_api.php?subcode=${formData.subcode}&topcode=${formData.topcode}`;
      } else {
        url = "https://railwaymcq.com/student/quiz_feedback_api.php";
      }

      const response = await axios.get(url);
      if (
        response.data.message ===
        "No feedback found for the specified subcode and topcode"
      ) {
        setQbankData([]);
      } else {
        setQbankData(response.data);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setQbankData([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    setQbankData((prevData) => {
      const newData = [...prevData];
      newData[index][name] = value;
      return newData;
    });
  };

  const handleFetchData = () => {
    fetchData();
  };

  const handleUpdate = async (index) => {
    try {
      let updatedItem = qbankData[index];
      updatedItem = { ...updatedItem, flagUser: true };
      const response = await axios.put(
        "https://railwaymcq.com/student/Qbank_op_api.php",
        updatedItem
      );
      alert("Successfully updation!!!!");

      setQbankData((prevData) => {
        const newData = [...prevData];
        newData[index] = response.data;
        return newData;
      });
      setEditingIndex(null); // Reset editing index after update
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index); // Set the editing index to the clicked row index
  };

  const handleGoBack = () => {
    // Set admin state to true in local storage
    localStorage.setItem("admin", "true");
    // Navigate to the login page
    // if(admin)
    navigate("/AdminPage");
  };

  // Get current qbank items
  const indexOfLastQbank = currentPage * qbankPerPage;
  const indexOfFirstQbank = indexOfLastQbank - qbankPerPage;
  const currentQbankData = qbankData?.slice(
    indexOfFirstQbank,
    indexOfLastQbank
  );

  return (
    <div className="container">
      <GoBack page={"MCQ FeedBack"} />

      <div className="row papaDiv">
        <div className="col-12 col-md-5 mb-1 ">
          <select
            className=" form-select Subject"
            name="subcode"
            value={formData.subcode}
            onChange={(e) => {
              setFormData({ ...formData, subcode: e.target.value });
              fetchTopcodes(e.target.value);
            }}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject.subcode}>
                {subject.sub}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-5">
          <select
            className="form-select Subject"
            name="topcode"
            value={formData.topcode}
            onChange={(e) =>
              setFormData({ ...formData, topcode: e.target.value })
            }
          >
            <option value="">Select Topic</option>
            {topcodes.map((topcode, index) => (
              <option key={index} value={topcode.topcode}>
                {topcode.topic}
              </option>
            ))}
          </select>
        </div>
        <div className=" col-12 col-md-2">
          <button
            className="btn btn-outline-success Subject"
            onClick={handleFetchData}
          >
            Fetch Data
          </button>
        </div>
        {qbankData.length === 0 ? (
          <div className="alert alert-info papaDiv">No feedback found</div>
        ) : null}
        {loading ? <Loading /> : null}
      </div>
      <div className="papaDiv">
        <div className=" d-flex justify-content-between">
          <div> No of feedback Found {qbankData.length}</div>
          <div>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={currentQbankData.length < qbankPerPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
        <table className="table table-hover table-striped">
          <thead>
            <tr className="table-dark">
              <th>Response</th>
              <th>Question</th>
              <th>Feedback</th>
              <th>Option 1</th>
              <th>Option 2</th>
              <th>Option 3</th>
              <th>Option 4</th>
              <th>Answer</th>
              <th>Reference</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentQbankData.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    backgroundColor: item.res_code === "0" ? "red" : "green",
                    color: "white",
                  }}
                >
                  {item.res_code === "0" ? "Pending" : "Attended"}
                </td>

                <td>
                  {editingIndex === index ? (
                    <textarea
                      style={{ width: "250px" }}
                      rows="6"
                      cols="50"
                      name="question"
                      value={item.question}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.question
                  )}
                </td>
                <td>{item.feedback}</td>
                <td>
                  {editingIndex === index ? (
                    <textarea
                      type="text"
                      name="option1"
                      value={item.option1}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option1
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <textarea
                      type="text"
                      name="option2"
                      value={item.option2}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option2
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <textarea
                      type="text"
                      name="option3"
                      value={item.option3}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option3
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <textarea
                      type="text"
                      name="option4"
                      value={item.option4}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option4
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <textarea
                      type="text"
                      name="answer"
                      value={item.answer}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.answer
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="reference"
                      value={item.reference}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.reference
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleUpdate(index)}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className=" d-flex justify-content-between">
        <button
          className="btn btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-outline-primary"
          disabled={currentQbankData.length < qbankPerPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FatchQbankFeedback;
