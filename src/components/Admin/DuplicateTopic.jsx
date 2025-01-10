import React, { useState, useEffect } from "react";
import { BsSignMergeLeftFill } from "react-icons/bs";
import { MdAutoDelete, MdDelete, MdRestorePage } from "react-icons/md";
import axios from "axios";
import { FaTableList } from "react-icons/fa6";
import { IoCloseCircleSharp } from "react-icons/io5";
import MargeTopic from "./MargeTopic";

function DuplicateTopic() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [margeData, setMargeData] = useState("");
  const [mIndex, setMIndx] = useState("");
  const [margeDataView, SetMargeDataView] = useState(false);
  const [mergeResponse, setMergeResponse] = useState("");
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/MCQTown/Duplicate_topic.php"
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const result = await response.json();
      if (result.status === "success") {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch data.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Fetch data from the API using the Fetch API
    fetchData();
  }, []);

  const handleAction = async (action, subcode, topcode, mode) => {
    let userConfirmed;
    if (mode === "Delete") {
      userConfirmed = window.confirm("Move to recycle bin..");
    }
    if (mode === "PDelete") {
      userConfirmed = window.confirm(
        "This topic and question of this topic will be 'Permanently Deleted' "
      );
    }
    if (mode === "Restore") {
      userConfirmed = window.confirm(
        "Are you sure you want to 'Restore' this?"
      );
    }

    if (userConfirmed) {
      try {
        const response = await fetch(
          "https://railwaymcq.com/railwaymcq/MCQTown/Delete_restore_topic.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              action,
              topcode,
              subcode,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setMessage(data);
        fetchData();
      } catch (error) {
        setMessage(error.message || "An error occurred. Please try again.");
      }
    } else {
      return;
    }
  };

  const handleMerge = (entry, data, indx, mode, topic) => {
    setMargeData(data);
    setMIndx({ ...entry, topic: topic });
    SetMargeDataView(true);
    setMergeResponse("");
  };
  useEffect(() => {
    if (
      mergeResponse.message === "Records updated successfully." &&
      mergeResponse.status === "success" &&
      mergeResponse.update_of_question_count === true
    ) {
      fetchData();
      SetMargeDataView(false);
    }
  }, [mergeResponse]);

  if (loading)
    return (
      <div className="container mt-5">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5">
        <p className="text-danger">Error: {error}</p>
        <button
          className="btn btn-sm btn-outline-success"
          onClick={() => {
            fetchData();
          }}
        >
          ReFetch data
        </button>
      </div>
    );

  return (
    <div className="container mt-5">
      {margeDataView && (
        <div
          style={{
            margin: "0",
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw",
            zIndex: "1",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            SetMargeDataView(false);
          }}
        >
          <div
            className="position-relative p-2"
            style={{
              boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
              background: "white",
              borderRadius: "15px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
              style={{
                height: "20px",
                width: "20px",
                cursor: "pointer",
                background: "white",
                borderRadius: "50%",
                zIndex: "100",
              }}
              onClick={() => {
                SetMargeDataView(false);
              }}
            >
              <IoCloseCircleSharp
                style={{
                  color: "red",
                  boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <MargeTopic
              data={margeData}
              mData={mIndex}
              setMergeResponse={setMergeResponse}
            />
          </div>
        </div>
      )}
      <h1 className="text-center mb-4">Duplicate Topics</h1>
      {data.length === 0 ? (
        <p>No duplicate topics found.</p>
      ) : (
        <div className="row">
          {data.map((item, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{item.top_topic}</h5>
                  <p className="card-text">
                    <strong>Duplicate Entries:</strong>
                  </p>
                  <b style={{ color: "#118fff" }}>
                    {" "}
                    <FaTableList /> Data Found{" "}
                  </b>
                  <table
                    className="table table-striped Subject"
                    style={{ border: "1px solid #a3d2fc" }}
                  >
                    <thead>
                      <tr className="table-primary">
                        <th>Sno</th>
                        <th>Department</th>
                        <th>Subject</th>
                        <th>Questions</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.duplicate_entries.map((entry, idx) => {
                        if (entry.delete_status === "none") {
                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{entry.deptt}</td>
                              <td>{entry.sub}</td>
                              <td>{entry.questions}</td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleMerge(
                                        entry,
                                        item.duplicate_entries,
                                        idx,
                                        "Marge",
                                        item.top_topic
                                      )
                                    }
                                    className="btn btn-info btn-sm"
                                  >
                                    <BsSignMergeLeftFill />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction(
                                        "delete",
                                        entry?.subcode,
                                        entry?.topcode,
                                        "Delete"
                                      )
                                    }
                                    className="btn btn-danger btn-sm"
                                  >
                                    <MdAutoDelete />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>

                  {item.duplicate_entries.some(
                    (entry) => entry.delete_status === "deleted"
                  ) && (
                    <div>
                      <b style={{ color: "#ff1123" }}>
                        {" "}
                        <FaTableList /> Deleted Data
                      </b>
                      <table
                        style={{ border: "1px solid #fc5562" }}
                        className="table table-striped"
                      >
                        {" "}
                        <thead>
                          <tr className="table-danger">
                            <th>Sno</th>
                            <th>Department</th>
                            <th>Subject</th>
                            <th>Questions</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.duplicate_entries.map((entry, idx) => {
                            if (entry.delete_status === "deleted") {
                              return (
                                <tr key={idx}>
                                  <td>{idx + 1}</td>
                                  <td>{entry.deptt}</td>
                                  <td>{entry.sub}</td>
                                  <td>{entry.questions}</td>
                                  <td>
                                    <div className="d-flex align-items-center gap-2">
                                      {/* permanent delete og topic and Questions */}
                                      <button
                                        onClick={() =>
                                          handleAction(
                                            "restore",
                                            entry?.subcode,
                                            entry?.topcode,
                                            "Restore"
                                          )
                                        }
                                        className="btn btn-success btn-sm"
                                      >
                                        <MdRestorePage />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleAction(
                                            "delete",
                                            entry?.subcode,
                                            entry?.topcode,
                                            "PDelete"
                                          )
                                        }
                                        className="btn btn-danger btn-sm"
                                      >
                                        <MdAutoDelete />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            return null;
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DuplicateTopic;
