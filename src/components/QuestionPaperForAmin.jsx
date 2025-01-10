import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { useNavigate } from "react-router-dom";
import { useTestContext } from "../Context/TestContext";
import CountdownTimer from "./CountdownTimer";
import { useUserContext } from "../Context/UserContext";
import QuestionFeedback from "./Feedback/QuestionFeedback";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaRecycle } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdAutoDelete, MdDelete, MdEdit, MdEditOff } from "react-icons/md";
import { FaUpload } from "react-icons/fa6";
import DeletedImag from "../img/Deleted.png";
import Loading from "./Loading";

const QuestionPaperForAdmin = () => {
  const { subject } = useGlobalContext();
  const { user } = useUserContext();
  const {
    start_Test,
    updateActiveQuestionStatus,
    updateActiveQuestion,
    userResponse,
    updateUserResponse,
    countDown,
  } = useTestContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [giveFeedback, setGiveFeedback] = useState(false);
  const [ansBtn, setansBtn] = useState(false);
  const [verBtn, setVerBtn] = useState(false);
  const [queBtn, setQueBtn] = useState(false);
  const [optBtn, setOptBtn] = useState(false);
  const [refBtn, setRefBtn] = useState(false);
  const [msg, setMsg] = useState(false);
  const [time, setTime] = useState(0); // State to keep track of elapsed time
  const [isRunning, setIsRunning] = useState(false); // State to control timer start/stop
  const [submitTestTimer, setSubmitTestTimer] = useState(false);
  const [submitPopUp, setSubmitPopUp] = useState(false);
  const [selectedAnsOpt, setSelectedAnsOpt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recycleBtnStatus, setRecycleBtnStatus] = useState(
    start_Test?.test[start_Test.activeQuestion]?.delete_status === "1"
      ? true
      : false
  );

  const [recycleBtnStatusObj, setRecycleBtnStatusObj] = useState({});
  const [formData, setFormData] = useState({
    qcode: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    Reference: "",
    verify_by: user.name,
    verify_flag: "",
    verify_date: "",
    queFrom: "",
  });
  const [message, setMessage] = useState("");

  const updateTheUserTestRecordTopicWise = async () => {
    setLoading(true); // Set loading state to true before making the API call

    try {
      // Ensure the user object is available and user.id is defined
      if (!user || !user.id) {
        throw new Error("User ID is not available");
      }

      // Properly encode the user ID for the URL (in case it contains special characters)
      const apiUrl = `https://railwaymcq.com/railwaymcq/MCQTown/user_test_record_update_and_insert.php?user_id=${encodeURIComponent(
        user.id
      )}`;

      // Make the API request
      const response = await fetch(apiUrl);

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse the response as JSON
      const result = await response.json();

      // Check for status in the result to handle API response
      if (result.status === "success") {
        // You can update UI or perform additional actions based on success
      } else {
        console.error("API error:", result.message);
        // Handle specific error response from the API
      }
    } catch (err) {
      console.error("Error occurred:", err); // Log error details for debugging
      // Optionally set the error state to show a message in the UI
      // setError(err.message);
    } finally {
      setLoading(false); // Always set loading to false, whether the request succeeds or fails
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChangePlushUpdate = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    handleSubmitToupdate();
  };
  const navigate = useNavigate();

  const submitTest = (action) => {
    if (action === "submit") {
      if (countDown?.remainingTime !== "0:0") {
        const confirmSubmit = window.confirm(
          `Are you sure you want to submit the test? You have ${countDown.remainingTime} minutes left`
        );
        if (!confirmSubmit) {
          return; // Cancel submission if user clicks cancel in the confirmation dialog
        }
      }

      setSubmitPopUp(true);
      setTimeout(() => {
        setSubmitTestTimer(true);
      }, 2000); // Start the timer after 2 seconds
    }
  };

  useEffect(() => {
    // Check if both submitTestTimer and submitPopUp are true for navigation
    if (submitTestTimer && submitPopUp) {
      setSubmitPopUp(false);
      updateTheUserTestRecordTopicWise();
      navigate("/TestSeries/Score-card");
    }
  }, [submitTestTimer, submitPopUp]);

  useEffect(() => {
    // Check if countdown reaches "0:0" and submitTestTimer is not true
    if (countDown?.remainingTime === "0:0" && !submitTestTimer) {
      setSubmitPopUp(true);
      setTimeout(() => {
        setSubmitTestTimer(true);
      }, 4000); // Start the timer after 4 seconds (adjust as needed)
    }
  }, [countDown?.remainingTime, submitTestTimer]);

  useEffect(() => {
    setSelectedOption(null);
    setMsg(false);
  }, [questionData]);

  useEffect(() => {
    if (!start_Test?.activeQuestion) {
      setQuestionData(start_Test?.test[0]);
    } else {
      setQuestionData(start_Test?.test[Number(start_Test?.activeQuestion)]);
    }
  }, [start_Test?.activeQuestion]);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const style = {
    boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "500px",
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const testAnswerForQuestion =
    userResponse?.testAnswer[questionIndex]?.timeTaken;

  const handleBtnClicked = (action) => {
    setGiveFeedback(false);
    if (action === "Next" || action === "Previous") {
      if (testAnswerForQuestion) {
      }
      const userResp = {
        ...userResponse?.testAnswer[questionIndex],
        timeTaken: !testAnswerForQuestion
          ? time
          : Number(time) + Number(testAnswerForQuestion),
      };

      updateUserResponse(userResp);
      setIsRunning(false);
      if (!questionData.activeQuestionStatus) {
        updateActiveQuestionStatus("Next");
      }

      let nextQuestionIndex;
      if (action === "Next") {
        nextQuestionIndex = Math.min(
          Number(start_Test.activeQuestion) + 1,
          Object.keys(start_Test.test).length - 1
        );
      } else {
        nextQuestionIndex = Math.max(Number(start_Test.activeQuestion) - 1, 0);
      }

      updateActiveQuestion(nextQuestionIndex);
    } else if (action === "Mark&review") {
      const userResp = {
        ...userResponse?.testAnswer[questionIndex],
        timeTaken: !testAnswerForQuestion
          ? time
          : Number(time) + Number(testAnswerForQuestion),
      };
      updateUserResponse(userResp);

      updateActiveQuestionStatus(action);
      setIsRunning(false);
      let nextQuestionIndex = Math.min(
        Number(start_Test.activeQuestion) + 1,
        Object.keys(start_Test.test).length - 1
      );
      updateActiveQuestion(nextQuestionIndex);
    } else if (action === "Save&next") {
      setIsRunning(false);
      if (selectedOption === null) {
        setMsg(true);
      } else {
        const userResp = {
          ...userResponse?.testAnswer[questionIndex],
          answer: selectedOption,
          timeTaken: !testAnswerForQuestion
            ? time
            : Number(time) + Number(testAnswerForQuestion),
        };

        updateUserResponse(userResp);
        updateActiveQuestionStatus(action);

        let nextQuestionIndex = Math.min(
          Number(start_Test.activeQuestion) + 1,
          Object.keys(start_Test.test).length
        );

        if (nextQuestionIndex === Object.keys(start_Test.test).length) {
          nextQuestionIndex = Object.keys(start_Test.test).length - 1;
        }

        updateActiveQuestion(nextQuestionIndex);
        handleSubmitUserRecord();
      }
    }
  };
  // ////
  const handleSubmitUserRecord = async () => {
    const formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("que_id", questionData?.qcode);
    formData.append(
      "que_status",
      selectedOption === questionData?.answer ? 1 : 0
    );

    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/user_test_record.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text(); // Read the response as text

      const result = JSON.parse(text); // Manually parse the JSON
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      qcode: questionData?.qcode,
      question: questionData?.question,
      option1: questionData?.options[0],
      option2: questionData?.options[1],
      option3: questionData?.options[2],
      option4: questionData?.options[3],
      answer: "",
      Reference: questionData?.Reference,
      verify_by: user?.name,
      verify_flag: "",
      verify_date: "",
      queFrom: "",
    });
  }, [questionData]);
  useEffect(() => {
    const qIndex = Math.min(
      Number(start_Test.activeQuestion) + 1,
      Object.keys(start_Test.test).length
    );
    setQuestionIndex(qIndex - 1);
  }, [start_Test.activeQuestion]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000); // Increment the time every second
    } else {
      setTime(0);
    }
    return () => clearInterval(timer); // Cleanup the interval on component unmount or when isRunning changes
  }, [isRunning]);

  useEffect(() => {
    setIsRunning(true);
  }, [start_Test.activeQuestion]);
  const handleFeedBackBtnClicked = () => {
    setGiveFeedback(!giveFeedback);
  };
  const changeBtn = (type) => {
    if (type === "A") {
      setansBtn(!ansBtn);
      if (ansBtn) {
        handleSubmitToupdate();
      }
    }
    if (type === "Q") {
      setQueBtn(!queBtn);
      if (queBtn) {
        handleSubmitToupdate();
      }
    }
    if (type === "O") {
      setOptBtn(!optBtn);
      if (optBtn) {
        handleSubmitToupdate();
      }
    }
    if (type === "P") {
      setRefBtn(!refBtn);
      if (refBtn) {
        handleSubmitToupdate();
      }
    }
    if (type === "V") {
      setVerBtn(!verBtn);
      if (verBtn) {
        handleSubmitToupdate();
      }
    }
  };

  const handleSelectChange = (event) => {
    setSelectedAnsOpt(event.target.value);
  };
  const handleSubmitToupdate = async (e) => {
    setLoading(true);
    const response = await fetch(
      "https://railwaymcq.com/railwaymcq/RailPariksha/update_Qbank_Data.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    setLoading(false);
    const result = await response.json();
    setMessage(result.success ? result.success : result.error);

    alert(result.success ? result.success : result.error);
  };

  const handleMoveToRecycle = async (id, qNo) => {
    const nextQuestion = Number(qNo) + 1;
    const userConfirmed = window.confirm(
      "Are you sure you want to move this question to recycle bin?"
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
      if (data.new_status === 1 || data.new_status === 0) {
        setRecycleBtnStatusObj({
          ...recycleBtnStatusObj,
          [nextQuestion]: !recycleBtnStatusObj[nextQuestion],
        });
        alert(
          recycleBtnStatusObj[nextQuestion]
            ? "Question removed from recyclebin successfully"
            : "Question moved to recyclebin successfully"
        );
      } else {
        alert(data.message);
      }
      // setRecycleBtnStatus(!recycleBtnStatus);
    } catch (error) {
      setLoading(false);
      alert("Error while moving to recycle bin");
    }
  };
  useEffect(() => {
    const nextQuestion = Number(start_Test.activeQuestion) + 1;
    if (nextQuestion in recycleBtnStatusObj) {
      return;
    } else {
      setRecycleBtnStatusObj({
        ...recycleBtnStatusObj,
        [nextQuestion]: recycleBtnStatus,
      });
    }
  }, [start_Test.activeQuestion]);
  // console.log(
  //   "ssssssssssssssssssss",
  //   recycleBtnStatusObj[Number(start_Test.activeQuestion) + 1],
  //   start_Test.activeQuestion
  // );
  return (
    <div className="col-12 col-md-12  position-relative" style={style}>
      {recycleBtnStatusObj[Number(start_Test.activeQuestion) + 1] ? (
        <div
          className="d-flex justify-content-center align-items-center position-absolute"
          style={{
            width: "100%", // Take the width of the parent div
            height: "100%", // Take the height of the parent div
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <img
            src={DeletedImag}
            alt="Question is deleted"
            style={{
              opacity: 0.3, // Set the opacity to reduce visibility (adjust as needed)
              maxWidth: "100%", // Ensure the image scales properly
              maxHeight: "100%", // Ensure the image doesn't exceed the parent height
              objectFit: "cover", // Ensures the image covers the div without stretching
              transform: "rotate(335deg)", // Rotate the image by 325 degrees
            }}
          />
        </div>
      ) : null}
      <div style={{ zIndex: 2 }}>
        ======== ADMIN VIEW ========
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="tooltip-dashboard">
              {recycleBtnStatusObj[Number(start_Test.activeQuestion) + 1]
                ? "Remove from recycle bin"
                : "Move to recycle bin"}
            </Tooltip>
          }
        >
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill  "
            style={{ cursor: "pointer", color: "white", fontSize: "14px" }}
            onClick={() =>
              handleMoveToRecycle(
                start_Test?.test[start_Test.activeQuestion].qcode,
                start_Test.activeQuestion
              )
            }
          >
            {recycleBtnStatusObj[Number(start_Test.activeQuestion) + 1] ? (
              <button className="btn btn-success Subject">
                <FaRecycle />
              </button>
            ) : (
              <button className="btn btn-danger Subject">
                <MdAutoDelete />
              </button>
            )}
          </span>
        </OverlayTrigger>
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
                  submitting your request
                  <Loading />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {submitPopUp ? (
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
                  <div className="spinner-border" role="status"></div>{" "}
                  <p>Submitting your test </p>
                  <p>Working on your Report Card.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // /////////////////////SECOND PART OF CONDITION ///////////////////////
          <div className="container" style={{ flex: "1" }}>
            <div className="row">
              <div className="justify-content-center align-items-center text-center">
                <h5>{subject.selectedTopic}</h5>
                <hr />
              </div>
            </div>
            <div
              className="row overflow-x"
              style={{
                minHeight: screenSize.width > 770 ? "240px" : "",
                // maxHeight: "auto",
              }}
            >
              <div className="">
                {start_Test?.test[start_Test.activeQuestion]?.user_response
                  ?.attempted ? (
                  <div style={{ border: "1px solid black" }}>"Attempted"</div>
                ) : (
                  ""
                )}
              </div>
              <div className="position-relative">
                {queBtn ? (
                  <div className="d-flex">
                    Q.{" "}
                    <textarea
                      type="text"
                      name="question"
                      onChange={handleChange}
                      value={formData.question}
                    />
                  </div>
                ) : (
                  <b className="text-start">
                    Q.
                    {!start_Test?.activeQuestion
                      ? "1"
                      : Number(start_Test?.activeQuestion) + 1}{" "}
                    - {questionData?.question}
                  </b>
                )}
                <div className="d-flex justify-content-end">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-dashboard">
                        {queBtn ? "Update" : "Update Question"}
                      </Tooltip>
                    }
                  >
                    <button
                      className={`text-end btn btn-sm btn-outline-${
                        queBtn ? "success" : "primary"
                      } m-1`}
                      onClick={() => {
                        changeBtn("Q");
                      }}
                    >
                      {queBtn ? <FaUpload /> : <MdEdit />}
                    </button>
                  </OverlayTrigger>
                  {queBtn ? (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-dashboard">Cancel</Tooltip>}
                    >
                      <button
                        className="text-end btn btn-sm btn-outline-danger m-1"
                        onClick={() => {
                          setQueBtn(false);
                        }}
                      >
                        <MdEditOff />
                      </button>
                    </OverlayTrigger>
                  ) : null}
                </div>
              </div>
              <div
                // style={{ paddingBottom: "50px" }}
                className="row m-1 text-start"
              >
                {}
                {questionData?.options?.map((option, index) => {
                  let selectedAns;

                  // Corrected the syntax for Object.entries and assignment logic
                  Object.entries(userResponse.testAnswer).map(
                    ([qNo, ansData]) => {
                      if (qNo == start_Test?.activeQuestion) {
                        selectedAns = ansData.answer;
                        return;
                      }
                    }
                  );

                  return (
                    <div className="form-check m-1" key={index}>
                      {optBtn ? (
                        <div>
                          <div className="d-flex">
                            {index + 1}
                            {index + 1 === 1 ? (
                              <input
                                className=""
                                style={{ minHeight: "30px" }}
                                type="text"
                                name="option1"
                                onChange={handleChange}
                                value={formData.option1}
                              />
                            ) : null}{" "}
                            {index + 1 === 2 ? (
                              <input
                                className=""
                                style={{ minHeight: "30px" }}
                                type="text"
                                name="option2"
                                onChange={handleChange}
                                value={formData.option2}
                              />
                            ) : null}{" "}
                            {index + 1 === 3 ? (
                              <input
                                className=""
                                style={{ minHeight: "30px" }}
                                type="text"
                                name="option3"
                                onChange={handleChange}
                                value={formData.option3}
                              />
                            ) : null}{" "}
                            {index + 1 === 4 ? (
                              <input
                                className=""
                                style={{ minHeight: "30px" }}
                                type="text"
                                name="option4"
                                onChange={handleChange}
                                value={formData.option4}
                              />
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            className="form-check-input border border-dark"
                            type="radio"
                            name="optionRadio"
                            id={`flexRadioDefault${index}`}
                            checked={
                              selectedAns
                                ? selectedAns === option
                                : selectedOption === option
                            }
                            onChange={() => handleOptionChange(option)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexRadioDefault${index}`}
                          >
                            {option}
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>{" "}
              <div className="d-flex justify-content-end">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      {optBtn ? "Update" : "Update Options"}
                    </Tooltip>
                  }
                >
                  <button
                    className={`btn btn-sm btn-outline-${
                      optBtn ? "success" : "primary"
                    } m-1`}
                    onClick={() => {
                      changeBtn("O");
                    }}
                  >
                    {optBtn ? <FaUpload /> : <MdEdit />}
                  </button>
                </OverlayTrigger>
                {optBtn ? (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-dashboard">Cancel</Tooltip>}
                  >
                    <button
                      className="text-end btn btn-sm btn-outline-danger m-1"
                      onClick={() => {
                        setOptBtn(false);
                      }}
                    >
                      <MdEditOff />
                    </button>
                  </OverlayTrigger>
                ) : null}
              </div>
            </div>
            <hr />
            {/* ////////////////////////////////////////////////////////////////////////////////// */}
            <div>
              <div>
                {Object.entries(start_Test.test).map(
                  ([qnoKey, qdatavalue], index) => {
                    return (
                      <div key={index}>
                        {qnoKey === String(start_Test.activeQuestion) ? (
                          <div className="text-start">
                            <div className="d-flex justify-content-between">
                              <div className="d-flex">
                                <b>Answer:</b>{" "}
                                {ansBtn ? (
                                  <select
                                    className="form-control"
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                  >
                                    {qdatavalue.options.map((option, index) => (
                                      <option key={index} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  qdatavalue.answer
                                )}{" "}
                              </div>
                              <div>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-dashboard">
                                      {ansBtn ? "update" : "Update answer"}
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className={`btn ms-5 me-1 btn-sm btn-outline-${
                                      ansBtn ? "success" : "primary"
                                    } m-1`}
                                    onClick={() => {
                                      changeBtn("A");
                                    }}
                                  >
                                    {ansBtn ? <FaUpload /> : <MdEdit />}
                                  </button>
                                </OverlayTrigger>
                                {ansBtn ? (
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        cancle
                                      </Tooltip>
                                    }
                                  >
                                    <button
                                      className={`text-end btn btn-sm btn-outline-danger m-1`}
                                      onClick={() => {
                                        setansBtn(false);
                                      }}
                                    >
                                      <MdEditOff />
                                    </button>
                                  </OverlayTrigger>
                                ) : null}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div className="d-flex">
                                {" "}
                                <b>Reference:</b>
                                {refBtn ? (
                                  <textarea
                                    type="text"
                                    style={{ minHeight: "38px" }}
                                    onChange={handleChange}
                                    name="Reference"
                                    value={formData.Reference}
                                  />
                                ) : (
                                  <div>{qdatavalue.Reference}</div>
                                )}
                              </div>
                              <div>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-dashboard">
                                      {refBtn ? "Update" : "Edit Reference"}
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className={`btn d btn-sm btn-outline-${
                                      refBtn ? "success" : "primary"
                                    } m-1`}
                                    onClick={() => {
                                      changeBtn("P");
                                    }}
                                    style={{ height: "30px" }}
                                  >
                                    {refBtn ? <FaUpload /> : <MdEdit />}
                                  </button>
                                </OverlayTrigger>
                                {refBtn ? (
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        Cancle
                                      </Tooltip>
                                    }
                                  >
                                    <button
                                      style={{ height: "30px" }}
                                      className={`text-end btn btn-sm btn-outline-danger m-1`}
                                      onClick={() => {
                                        setRefBtn(false);
                                      }}
                                    >
                                      <MdEditOff />
                                    </button>
                                  </OverlayTrigger>
                                ) : null}
                              </div>
                            </div>
                            <div>
                              <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                  {qdatavalue?.verify_flag === "0" ? null : (
                                    <b>
                                      verified by : {qdatavalue.verify_by} ,
                                    </b>
                                  )}
                                  <div className=" d-flex">
                                    {" "}
                                    <b>
                                      {verBtn ? "change" : null} Status :{" "}
                                    </b>{" "}
                                    {verBtn ? (
                                      <select
                                        className="form-control "
                                        name="verify_flag"
                                        value={formData.verify_flag}
                                        onChange={handleChange}
                                      >
                                        <option selected>
                                          {" "}
                                          select an option
                                        </option>
                                        <option value={1}> Verified</option>
                                        <option value={0}> Not Verified</option>
                                      </select>
                                    ) : qdatavalue?.verify_flag === "0" ? (
                                      "Not Verified"
                                    ) : (
                                      "Verified"
                                    )}{" "}
                                  </div>
                                </div>

                                <div className="">
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        {verBtn ? "update" : "Update Status"}
                                      </Tooltip>
                                    }
                                  >
                                    <button
                                      className={`btn ms-5 me-1 btn-sm btn-outline-${
                                        verBtn ? "success" : "primary"
                                      } m-1`}
                                      onClick={() => {
                                        changeBtn("V");
                                      }}
                                    >
                                      {verBtn ? <FaUpload /> : <MdEdit />}
                                    </button>
                                  </OverlayTrigger>
                                  {verBtn ? (
                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={
                                        <Tooltip id="tooltip-dashboard">
                                          cancle
                                        </Tooltip>
                                      }
                                    >
                                      <button
                                        className={`text-end btn btn-sm btn-outline-danger m-1`}
                                        onClick={() => {
                                          setVerBtn(false);
                                        }}
                                      >
                                        <MdEditOff />
                                      </button>
                                    </OverlayTrigger>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              {screenSize.width >= 500 ? (
                <div className="row">
                  <div className="d-flex justify-content-between align-items-center ">
                    <div className="me-1">
                      <button
                        className="btn btn-outline-primary btn-sm  me-1 m-1"
                        onClick={() => handleBtnClicked("Previous")}
                      >
                        previous
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="btn  btn-sm btn-warning m-1"
                        onClick={() => handleBtnClicked("Mark&review")}
                      >
                        Mark for review
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="btn ms-1 me-1 btn-sm btn-outline-primary m-1"
                        onClick={() => handleBtnClicked("Next")}
                      >
                        next
                      </button>
                    </div>
                    <div className="">
                      <button
                        className={`btn ms-1 me-1 btn-sm btn-outline-dark m-1 ${
                          giveFeedback ? "active" : null
                        }`}
                        onClick={() => handleFeedBackBtnClicked("FeedBack")}
                      >
                        Feedback{" "}
                        {giveFeedback ? (
                          <FaAngleDoubleUp />
                        ) : (
                          <FaAngleDoubleDown />
                        )}
                      </button>
                    </div>
                    <div className="ms-auto">
                      {start_Test.activeQuestion ===
                      Object.keys(start_Test.test).length - 1 ? (
                        <button
                          className="btn  ms-1 me-1 btn-sm btn-success m-1"
                          onClick={() => {
                            handleBtnClicked("Save&next");
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn ms-1 me-1 btn-sm btn-success m-1"
                          onClick={() => handleBtnClicked("Save&next")}
                        >
                          save & next
                        </button>
                      )}
                      {msg ? (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "red",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          please select an option first
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container text-center">
                  <div className="row">
                    <div className="col-6 col-sm-3">
                      <button
                        className="btn btn-sm btn-primary m-1"
                        onClick={() => handleBtnClicked("Previous")}
                      >
                        previous
                      </button>
                    </div>
                    <div className="col-6 col-sm-3">
                      <button
                        className="btn btn-warning m-1"
                        onClick={() => handleBtnClicked("Mark&review")}
                        style={{ fontSize: "12px" }}
                      >
                        Mark for review
                      </button>
                    </div>

                    <div className="w-100"></div>

                    <div className="col-6 col-sm-3">
                      <button
                        className="btn btn-sm btn-primary m-1"
                        onClick={() => handleBtnClicked("Next")}
                      >
                        next
                      </button>
                    </div>
                    <div className="col-6 col-sm-3">
                      <button
                        className="btn ms-1 me-1 btn-sm btn-outline-dark m-1"
                        onClick={() => handleFeedBackBtnClicked("FeedBack")}
                      >
                        Feedback{" "}
                        {giveFeedback ? (
                          <FaAngleDoubleUp />
                        ) : (
                          <FaAngleDoubleDown />
                        )}
                      </button>
                    </div>
                    <div className="col-6 col-sm-3">
                      {start_Test.activeQuestion ===
                      Object.keys(start_Test.test).length - 1 ? (
                        <button
                          className="btn btn-sm btn-success m-1"
                          onClick={() => {
                            handleBtnClicked("Save&next");
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success m-1"
                          onClick={() => handleBtnClicked("Save&next")}
                        >
                          save & next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}{" "}
              {giveFeedback ? (
                <QuestionFeedback
                  questionData={questionData}
                  giveFeedback={giveFeedback}
                  setGiveFeedback={setGiveFeedback}
                />
              ) : null}
              <hr />
              <div className="row">
                <button
                  className="btn btn-danger m-1"
                  onClick={() => {
                    submitTest("submit");
                  }}
                >
                  Submit{" "}
                </button>
              </div>
            </div>{" "}
            <p>
              {" "}
              Note: in case of wrong or inappropriate translation please set the
              language to English.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPaperForAdmin;
