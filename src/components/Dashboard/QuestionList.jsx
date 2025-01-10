import React, { useState, useEffect } from "react";
import { MdNearbyError } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useUserContext } from "../../Context/UserContext";
import PublishYourTest from "./PublishYourTest";
import Loading from "../Loading";

const QuestionList = ({ data }) => {
  const { user } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(20); // Display 20 questions per page
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [setName, setSetName] = useState("");
  const [setDis, setSetDis] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState(data);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredQuestions(data);
    } else {
      setFilteredQuestions(
        data.filter((q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredQuestions?.length / questionsPerPage);
  const currentQuestions = filteredQuestions?.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCheck = (qcode, question) => {
    const isSelected = selectedQuestions?.some((q) => q.qcode === qcode);
    if (isSelected) {
      setSelectedQuestions((prevSelected) =>
        prevSelected?.filter((q) => q.qcode !== qcode)
      );
    } else {
      setSelectedQuestions((prevSelected) => [
        ...prevSelected,
        { qcode, question },
      ]);
    }
  };

  const handleRemove = (qcode) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected?.filter((q) => q.qcode !== qcode)
    );
  };

  const handleSave = async (event) => {
    if (setName === "" && selectedQuestions?.length === 0) {
      setMsg({
        status: "error",
        message: "Please select any Question and name the test ",
      });
      return;
    }
    if (setName === "") {
      setMsg({
        status: "error",
        message: "Please name the test ",
      });
      return;
    }
    if (selectedQuestions?.length === 0) {
      setMsg({
        status: "error",
        message: "You haven't selected any Question",
      });
      return;
    }

    event.preventDefault();

    // Map through selected questions to get their qcodes
    const qid = selectedQuestions.map((item) => item.qcode);
    const string = qid.join(","); // Join qcodes as a comma-separated string

    // Create a FormData object
    const formData = new FormData();
    formData.append("user_id", user?.id); // Assuming user ID is available
    formData.append("set_name", setName);
    formData.append("qcodes", string);
    formData.append("description", setDis); // Append the description

    try {
      setLoading(true);
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/MCQTown/User_Question_Set.php", // Your PHP endpoint
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text(); // Read raw response
      // Log the raw response for debugging

      const result = JSON.parse(text); // Try parsing JSON
      setLoading(false);
      setMsg(result);
      // console.log(result);
      if (result.status === "success") {
        setSetName("");
        setSetDis("");
        setSelectedQuestions([]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("There was an error submitting the data.");
    }
  };

  useEffect(() => {
    // If msg is not empty, set a timeout to reset it after 4 seconds
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 4000);

      // Cleanup the timeout if the component unmounts or if msg changes
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <div className="container">
      <div class="row papaDiv">
        <div class={`col-md-${selectedQuestions?.length === 0 ? "12" : "8"}`}>
          {" "}
          {data?.length === 0 ? (
            <h4 style={{ color: "red" }}>
              {" "}
              <MdNearbyError /> No Question Found
            </h4>
          ) : (
            <div className="papaDiv">
              <h1>Question List</h1>

              {/* Search input */}
              <input
                className="Subject form-control"
                type="text"
                placeholder="Search question keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div
                className="scrollspy-example-2"
                style={{
                  minHeight: "20px",
                  maxHeight: "450px",
                  overflow: "auto",
                }}
              >
                <div>
                  {currentQuestions?.map((question) => (
                    <div
                      className="papaDiv"
                      key={question.qcode}
                      style={{
                        border: "1px solid #95c6f7",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        padding: "5px",
                      }}
                    >
                      <div>
                        <label className="d-flex">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedQuestions?.some(
                              (q) => q.qcode === question.qcode
                            )}
                            onChange={() =>
                              handleCheck(question?.qcode, question?.question)
                            }
                          />
                          &nbsp;&nbsp;<h6>{question.question}</h6>
                        </label>
                      </div>

                      <ul>
                        <li>{question.option1}</li>
                        <li>{question.option2}</li>
                        <li>{question.option3}</li>
                        <li>{question.option4}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Pagination buttons */}
          {data?.length > 20 ? (
            <div>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
        <div className="col-6 col-md-4 ">
          {" "}
          {/* Display selected questions */}
          {selectedQuestions?.length > 0 ? (
            <div
              style={{
                margin: "0px",
                padding: "0px",
              }}
            >
              <h3>Selected Questions:</h3>
              <div className="text-end">
                Question added {selectedQuestions?.length}
              </div>
              <hr />
              <div
                style={{
                  minHeight: "0px",
                  maxHeight: "500px",
                  overflowY: "auto", // Enable scrolling on the Y axis
                  overflowX: "hidden", // Hide scrolling on the X axis
                }}
                className="scrollspy-example-2 pt-2 pe-2"
              >
                <ol
                  type="1"
                  className="me-1"
                  style={{
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  {selectedQuestions.map(({ qcode, question }, index) => (
                    <li
                      style={{ border: "1px solid #95f7a5" }}
                      key={qcode}
                      className=" papaDiv d-flex position-relative"
                    >
                      <RiDeleteBin6Fill
                        style={{
                          padding: "2px",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "17px",
                        }}
                        onClick={() => {
                          handleRemove(qcode);
                        }}
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      />

                      <div style={{ fontSize: "13px" }}>
                        <b>{index + 1},</b>
                        {question}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* <PublishYourTest data={selectedQuestions} /> */}{" "}
      <div className="row papaDiv">
        <div className="col-md-5">
          Name of the set <b style={{ color: "red" }}>*</b>
          <input
            className="form-control Subject"
            type="text"
            placeholder="name of the set"
            value={setName}
            style={{ height: "36px" }}
            onChange={(e) => setSetName(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          Description
          <input
            className="form-control Subject"
            type="text"
            placeholder="Description like -subject,topics..etc"
            value={setDis}
            style={{ height: "36px" }}
            onChange={(e) => setSetDis(e.target.value)}
          />
          {console.log(setDis)}
        </div>
        <div className="col-md-2">
          &nbsp;
          <div className="row">
            <button
              className={` Subject btn  btn-outline-${
                setName === ""
                  ? "danger"
                  : selectedQuestions?.length === 0
                  ? "danger"
                  : "success"
              }`}
              style={{ height: "36px" }}
              onClick={handleSave}
            >
              {" "}
              save
            </button>
            {loading ? <Loading /> : null}
            {msg ? (
              <div
                style={{ color: msg.status === "success" ? `green` : "red" }}
              >
                {msg.message}
              </div>
            ) : null}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default QuestionList;
