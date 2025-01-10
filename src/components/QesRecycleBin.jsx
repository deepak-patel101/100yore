import React, { useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { FaRecycle } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { MdEditDocument } from "react-icons/md";
import { useTestContext } from "../Context/TestContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const QesRecycleBin = () => {
  const { user } = useUserContext();
  const { SetStartTestData, temp_test_data: test_data } = useTestContext();
  const { subject, activePage } = useGlobalContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchTestInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/Recycled_Questions.php?topicCode=${subject.selectedTopicCode}&subjectcode=${subject.subjectCode}&&user_id=${user.id}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setLoading(false);
      const data = await response.json();

      setData(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching SUBJECT_MASTER info:", error);
    }
  };

  useEffect(() => {
    fetchTestInfo();
  }, [subject]);
  const handleRestore = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to restore this question?"
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels the confirmation
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/Update_Question_Delete_Status.php?qcode=${id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setLoading(false);
      alert(
        data.message === "Question moved to recyclebin successfully"
          ? "Question Restored Successfully"
          : null
      );
    } catch (error) {
      setLoading(false);
      alert("Error while moving to recycle bin");
    }
    fetchTestInfo();
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to 'PERMANENTLY DELETE' this question?"
    );

    if (!userConfirmed) {
      return; // Exit the function if the user cancels the confirmation
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/Delete_Recycled_Question.php?qcode=${id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setLoading(false);
      alert(data.message);
    } catch (error) {
      setLoading(false);
      alert("Error while moving to recycle bin");
    }
    fetchTestInfo();
  };

  const handleEdit = (testDataToStartTest) => {
    SetStartTestData(testDataToStartTest);
    navigate("/TestSeries/Start-Test");
  };

  return (
    <div
      className="m-1"
      style={{ maxWidth: "95vw", maxHeight: "95vh", overflow: "auto" }}
    >
      {loading ? (
        <div>
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
              boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
              borderRadius: "15px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                background: "white",
                borderRadius: "15px",
              }}
              className="position-relative "
            >
              <div className="m-3">
                Working on your request
                <Loading />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {data === null ||
      data.message ===
        "No MCQs found for the given topic code and subject code" ? (
        <div className="m-3"> Nothing to Restore</div>
      ) : (
        <div style={{ height: "80vh", width: "80vw" }}>
          <div className="d-flex justify-content-between me-3">
            <div>
              {" "}
              {subject?.department}&#62;{subject?.subject}&#62;
              {subject?.selectedTopic}
            </div>
            <div> Total Questions-{data.length}</div>
          </div>

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col" style={{ minWidth: "40vw" }}>
                  Question
                </th>
                <th scope="col" style={{ maxWidth: "50px" }}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-dashboard">
                        Click here to edit all at once
                      </Tooltip>
                    }
                  >
                    <button
                      className="btn btn-link p-0"
                      onClick={() =>
                        handleEdit({
                          set: data,
                          timing: data.length,
                        })
                      }
                      style={{
                        border: "none",
                        background: "none",
                        color: "black",
                      }}
                    >
                      <b>Edit</b>
                    </button>
                  </OverlayTrigger>
                </th>

                <th scope="col" style={{ maxWidth: "50px" }}>
                  Restore
                </th>
                <th scope="col" style={{ maxWidth: "50px" }}>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((object, key) => {
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{object.question}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary"
                        // onClick={() => {
                        //   handleEdit(data[key]);
                        // }}
                        onClick={() =>
                          handleEdit({
                            set: [data[key]],
                            timing: 1,
                          })
                        }
                      >
                        <MdEditDocument />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => {
                          handleRestore(object.qcode);
                        }}
                      >
                        {" "}
                        <FaRecycle />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                          handleDelete(object.qcode);
                        }}
                      >
                        <RiDeleteBin6Fill />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default QesRecycleBin;
