import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../Component/css/EditableQbankData.css";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import GoBack from "./comps/GoBack";
import Loading from "../Loading";

const VideoModification = () => {
  const [qbankData, setQbankData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    subcode: "",
    topcode: "",
    title: "",
    link: " ",
    description: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [qbankPerPage] = useState(20);

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
      setTopcodes([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://railwaymcq.com/student/videomodification_api.php?subcode=${formData.subcode}&topcode=${formData.topcode}`
      );
      setLoading(false);
      setQbankData(Array.isArray(response.data) ? response.data : []);
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

    if (name === "subcode") {
      fetchTopcodes(value);
    }
  };

  const handleFetchData = () => {
    fetchData();
  };

  const handleUpdate = async (index) => {
    try {
      const updatedItem = qbankData[index];
      const response = await axios.put(
        "https://railwaymcq.com/student/videomodification_api.php",
        updatedItem
      );
      setQbankData((prevData) => {
        const newData = [...prevData];
        newData[index] = response.data;
        return newData;
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleDelete = async (index) => {
    const updatedItem = qbankData[index];
    if (
      window.confirm(
        `Are you sure you want to delete this video id ${updatedItem.id}`
      )
    ) {
      try {
        const response = await axios.delete(
          "https://railwaymcq.com/student/videomodification_api.php",
          {
            data: { id: updatedItem.id },
          }
        );

        alert("Video deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video!");
      }
    }
  };

  const handleEdit = async (index) => {
    setEditingIndex(index);
    await fetchTopcodes(qbankData[index].subcode);
  };

  const indexOfLastQbank = currentPage * qbankPerPage;
  const indexOfFirstQbank = indexOfLastQbank - qbankPerPage;
  const currentQbankData = qbankData.slice(indexOfFirstQbank, indexOfLastQbank);

  return (
    <div className="container papaDiv">
      <GoBack page={"Edit Videos"} />

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
        {loading && <Loading />}
      </div>

      <div className="qbank-table-container">
        <div className="d-flex justify-content-between">
          <div>Total video Found: {qbankData.length}</div>
          <div className="d-flex justify-content-between">
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
        <table className="table table-hover  table-striped">
          <thead>
            <tr className="table-dark">
              <th>Video ID</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Title</th>
              <th>Link</th>
              <th>Description</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentQbankData) &&
              currentQbankData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>
                    {editingIndex === index ? (
                      <select
                        style={{ maxWidth: "100px" }}
                        name="subcode"
                        value={item.subcode}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject, idx) => (
                          <option key={idx} value={subject.subcode}>
                            {subject.sub}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.sub
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <select
                        style={{ maxWidth: "100px" }}
                        name="topcode"
                        value={item.topcode}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">Select Topic</option>
                        {topcodes.map((topcode, idx) => (
                          <option key={idx} value={topcode.topcode}>
                            {topcode.topic}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.topic
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <textarea
                        type="text"
                        name="title"
                        value={item.title}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      item.title
                    )}
                  </td>
                  <td>{item.link}</td>
                  <td>
                    {editingIndex === index ? (
                      <textarea
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <button onClick={() => handleUpdate(index)}>
                        Update
                      </button>
                    ) : (
                      <FaEdit
                        style={{ color: "blue" }}
                        size={30}
                        onClick={() => handleEdit(index)}
                      />
                    )}
                  </td>
                  <td>
                    {/* <button onClick={() => handleDelete(index)}> */}
                    <MdDeleteForever
                      style={{ color: "red" }}
                      size={30}
                      button
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between">
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
  );
};

export default VideoModification;
