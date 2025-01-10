import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdCancel, MdDelete } from "react-icons/md";

const EditableQbankData = () => {
  const [qbankData, setQbankData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [loading, setLoading] = useState(false);
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
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [qbankPerPage] = useState(20);

  const tableRef = useRef(null); // Add this line

  useEffect(() => {
    fetchSubjects();
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 10); // Scroll to the top of the page
  // }, [currentPage]);

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
      const response = await axios.get(
        `https://railwaymcq.com/student/Qbank_op_api.php?subcode=${formData.subcode}&topcode=${formData.topcode}`
      );
      setLoading(false);
      setQbankData(response.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
      setQbankData([]);
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
      const updatedItem = qbankData[index];
      const response = await axios.put(
        "https://railwaymcq.com/student/Qbank_op_api.php",
        updatedItem
      );
      setQbankData((prevData) => {
        const newData = [...prevData];
        newData[index] = response.data;
        return newData;
      });
      setEditingIndex(null);
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const indexOfLastQbank = currentPage * qbankPerPage;
  const indexOfFirstQbank = indexOfLastQbank - qbankPerPage;
  const currentQbankData = qbankData?.slice(
    indexOfFirstQbank,
    indexOfLastQbank
  );

  const handleNextPage = (action) => {
    if (action === "next") {
      setCurrentPage(currentPage + 1);
    }
    if (action === "prev") {
      setCurrentPage(currentPage - 1);
    }
    if (tableRef.current) {
      const tablePosition =
        tableRef.current.getBoundingClientRect().top + window.scrollY - 50; // Adjust offset as needed
      window.scrollTo({
        top: tablePosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
    if (tableRef.current) {
      const tablePosition =
        tableRef.current.getBoundingClientRect().top + window.scrollY - 50; // Adjust offset as needed
      window.scrollTo({
        top: tablePosition,
        behavior: "smooth",
      });
    }
  };

  const handleDelete = async (index) => {
    const updatedItem = qbankData[index];
    if (
      window.confirm(
        `Are you sure you want to delete this question ${updatedItem.qcode}`
      )
    ) {
      try {
        const response = await axios.delete(
          "https://railwaymcq.com/student/Qbank_op_api.php",
          {
            data: { qcode: updatedItem.qcode },
          }
        );

        alert("Question deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete Question!");
      }
    }
  };

  return (
    <div className="editable-qbank-container papaDiv">
      <h5 className="text-start">
        <FaEdit /> Editable Qbank Data
      </h5>
      <hr />
      <div className="row ms-1 me-1 papaDiv">
        <div className="col-12 col-md-5 mb-1">
          <select
            className="form-select Subject"
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
        <div className="col-12 col-md-5 mb-1">
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
        <div className="col-12 col-md-2 mb-1 ">
          <button
            className="btn btn-outline-success Subject"
            onClick={handleFetchData}
          >
            Fetch Data
          </button>
        </div>
        {loading && (
          <div className="d-flex justify-content-center mt-1">
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
        )}
      </div>
      <div className="m-1 ">
        <div className=" d-flex justify-content-evenly">
          <div>No of question fond- {qbankData.length}</div>
          <div className="d-flex justify-content-evenly ms-1">
            <button
              className="btn btn-outline-dark"
              disabled={currentPage === 1}
              onClick={() => handleNextPage("prev")}
            >
              Prev
            </button>
            <span className="ms-1">Page {currentPage}</span>
            <button
              className="btn btn-outline-dark ms-1"
              disabled={currentQbankData.length < qbankPerPage}
              onClick={() => handleNextPage("next")} // Change the onClick handler
            >
              Next
            </button>
          </div>
          <div></div>
        </div>
        <table className="table table-striped table-hover" ref={tableRef}>
          {" "}
          {/* Add the ref here */}
          <thead>
            <tr className="table-dark">
              <th className="col-12 col-md-1" style={{ width: "50px" }}>
                No
              </th>
              <th className="col-12 col-md-5">Question</th>
              <th className="col-12 col-md-1">Option 1</th>
              <th className="col-12 col-md-1">Option 2</th>
              <th className="col-12 col-md-1">Option 3</th>
              <th className="col-12 col-md-1">Option 4</th>
              <th className="col-12 col-md-1">Answer</th>
              <th className="col-12 col-md-1">Reference</th>
              <th className="col-12 col-md-1">Edit</th>
              <th className="col-12 col-md-1">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentQbankData.map((item, index) => (
              <tr key={index}>
                <td style={{ width: "50px" }}>
                  {(currentPage - 1) * 20 + index + 1}
                </td>

                <td className="col-12 col-md-5 ">
                  {editingIndex === index ? (
                    <textarea
                      style={{ maxWidth: "250px" }}
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
                <td className="col-12 col-md-1 ">
                  {editingIndex === index ? (
                    <textarea
                      style={{ maxWidth: "90px", height: "100%" }}
                      type="text"
                      name="option1"
                      value={item.option1}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option1
                  )}
                </td>
                <td className="col-12 col-md-1 ">
                  {editingIndex === index ? (
                    <textarea
                      style={{ maxWidth: "90px", height: "100%" }}
                      type="text"
                      name="option2"
                      value={item.option2}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option2
                  )}
                </td>
                <td className="col-12 col-md-1 ">
                  {editingIndex === index ? (
                    <textarea
                      style={{ maxWidth: "90px", height: "100%" }}
                      type="text"
                      name="option3"
                      value={item.option3}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option3
                  )}
                </td>
                <td className="col-12 col-md-1 ">
                  {editingIndex === index ? (
                    <textarea
                      style={{ maxWidth: "90px", height: "100%" }}
                      type="text"
                      name="option4"
                      value={item.option4}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option4
                  )}
                </td>
                <td className="col-12 col-md-1 ">
                  {editingIndex === index ? (
                    <textarea
                      style={{ maxWidth: "90px", height: "100%" }}
                      type="text"
                      name="answer"
                      value={item.answer}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.answer
                  )}
                </td>
                <td className="col-12 col-md-1 ">
                  {editingIndex === index ? (
                    <input
                      style={{ maxWidth: "90px" }}
                      type="text"
                      name="reference"
                      value={item.reference}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.reference
                  )}
                </td>
                <td
                  className="col-12 col-md-1 position-relative  "
                  style={{ height: "100%" }}
                >
                  {editingIndex === index ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-outline-dark Subject"
                        onClick={() => handleUpdate(index)}
                      >
                        Update
                      </button>
                      <MdCancel
                        className="Subject position-absolute end-0 top-0"
                        onClick={() => setEditingIndex(null)}
                        style={{
                          borderRadius: "50%",
                          color: "red",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "100%" }}
                    >
                      {/* <button
                        className="btn btn-outline-dark"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button> 
 */}

                      <FaEdit
                        // className="btn btn-outline-dark"
                        style={{ color: "blue" }}
                        size={30}
                        onClick={() => handleEdit(index)}
                      />
                    </div>
                  )}
                </td>

                <td className="col-12 col-md-1 ">
                  <MdDelete
                    onClick={() => handleDelete(index)}
                    style={{ color: "red" }}
                    size={30}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-evenly">
        <button
          className="btn btn-outline-dark"
          disabled={currentPage === 1}
          onClick={() => handleNextPage("prev")}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-outline-dark"
          disabled={currentQbankData.length < qbankPerPage}
          onClick={() => handleNextPage("next")}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EditableQbankData;
