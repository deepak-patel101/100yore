import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { useNavigate } from "react-router-dom";
import { useTestContext } from "../Context/TestContext";
import CountdownTimer from "./CountdownTimer";
import QuestionFeedback from "./Feedback/QuestionFeedback";
import { FaAngleDoubleDown, FaAngleDoubleUp, FaLanguage } from "react-icons/fa";
import { useUserContext } from "../Context/UserContext";
import GoogleTranslate from "./GoogleTranslate";
import axios from "axios";
import { GiConsoleController } from "react-icons/gi";
const QuestionPaper = () => {
  const { user } = useUserContext();
  const { subject } = useGlobalContext();
  const {
    start_Test,
    updateActiveQuestionStatus,
    updateActiveQuestion,
    userResponse,
    updateUserResponse,
    countDown,
  } = useTestContext();
  const [userEachQueRes, setUserEachQueRes] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [questionData, setQuestionData] = useState(null);
  const [giveFeedback, setGiveFeedback] = useState(false);
  const [msg, setMsg] = useState(false);
  const [time, setTime] = useState(0); // State to keep track of elapsed time
  const [isRunning, setIsRunning] = useState(false); // State to control timer start/stop
  const [submitTestTimer, setSubmitTestTimer] = useState(false);
  const [submitPopUp, setSubmitPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeNo, setActiveNo] = useState(1);
  const navigate = useNavigate();

  console.log(questionData);

  const updateTheUserTestRecordTopicWise = async () => {
    setLoading(true); // Set loading state to true before making the API call

    try {
      // Ensure the user object is available and user.id is defined
      if (!user || !user.id) {
        throw new Error("User ID is not available");
      }

      // Properly encode the user ID for the URL (in case it contains special characters)
      const apiUrl = `https://railwaymcq.com/railwaymcq/100YoRE/user_test_record_update_and_insert.php?user_id=${encodeURIComponent(
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
  const submitUserAnswerSheet = async (data) => {
    try {
      const response = await axios.post(
        "https://railwaymcq.com/railwaymcq/100YoRE/Uplaod_user_Ans_Sheet.php",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      updateTheUserTestRecordTopicWise();
    } catch (error) {
      console.error("There was an error!", error);
      alert("Error submitting data!");
    }
  };

  useEffect(() => {
    // Check if both submitTestTimer and submitPopUp are true for navigation
    if (submitTestTimer && submitPopUp) {
      let tempUserRes = {
        ...userResponse,
        user_id: user.id,
        set_No: start_Test.test[0].set_No,
        topcode: subject.selectedTopicCode,
        subcode: subject.subjectCode,
      };
      handleSubmitUserRecordAtFinalSubmit();

      setSubmitPopUp(false);

      submitUserAnswerSheet(tempUserRes);
      // updateTheUserTestRecordTopicWise();
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
    setAllSelectedOptions([...allSelectedOptions, option]);
  };

  const testAnswerForQuestion =
    userResponse?.testAnswer[questionIndex]?.timeTaken;

  const handleBtnClicked = (action) => {
    setGiveFeedback(false);
    if (action === "Next" || action === "Previous") {
      if (testAnswerForQuestion) {
      }
      const userResp = {
        ...userResponse?.testAnswer[questionData?.qcode],
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
        ...userResponse?.testAnswer[questionData?.qcode],
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
          ...userResponse?.testAnswer[questionData?.qcode],
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
    setUserEachQueRes((prevState) => ({
      ...prevState,
      user_id: user?.id,
      set_No: questionData?.set_No,
      data: {
        ...prevState?.data,
        [questionData?.qcode]: {
          que_status: selectedOption === questionData?.answer ? 1 : 0,
        },
      },
    }));
  };

  const handleSubmitUserRecordAtFinalSubmit = async () => {
    try {
      const payload = {
        user_id: userEachQueRes.user_id,
        set_No: userEachQueRes.set_No,
        data: userEachQueRes.data,
      };

      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/100YoRE/user_test_record.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // Log the response text to see if it's valid JSON
      const textResponse = await response.text();

      // Try parsing the JSON after logging it
      const result = JSON.parse(textResponse); // Parsing manually

      if (response.ok) {
        // Handle success
      } else {
        console.error("Submission failed:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ///////
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
  useEffect(() => {
    setActiveNo(
      !start_Test.activeQuestion ? "1" : Number(start_Test.activeQuestion) + 1
    );
  }, [start_Test?.activeQuestion]);
  return (
    <div className="container col-12 col-md-12" style={style}>
      {submitPopUp ? (
        <div>
          <div
            className=""
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
              className=" "
            >
              <div className="m-3">
                <div className="spinner-border" role="status"></div>{" "}
                <p>Submitting your test </p>
                <p>Working on your Report Card.</p>
              </div>
            </div>
          </div>{" "}
        </div>
      ) : (
        // /////////////////////SECOND PART OF CONDITION ///////////////////////

        <div className="container" style={{ flex: "1" }}>
          <div className="row ">
            <div className="justify-content-center align-items-center text-center">
              <h5>{subject.selectedTopic}</h5>
              <hr />
            </div>
          </div>
          <div
            className=" row overflow-x"
            style={{
              minHeight: screenSize.width > 770 ? "240px" : "",
              // maxHeight: "auto",
            }}
          >
            {" "}
            <div className="">
              {start_Test?.test[start_Test.activeQuestion]?.user_response
                ?.attempted ? (
                <div style={{ border: "1px solid black" }}>"Attempted"</div>
              ) : (
                ""
              )}
            </div>
            <div className="d-flex">
              <h6>{activeNo ? activeNo : "-"}</h6>
              <h6>- </h6>
              <div>
                {/* {questionData?.question} */}
                <div
                  dangerouslySetInnerHTML={{ __html: questionData?.question }}
                />
              </div>
            </div>
            <div
              // style={{ paddingBottom: "50px" }}
              className="row m-1 text-start"
            >
              {questionData?.options?.map((option, index) => {
                let selectedAns;
                // Corrected the syntax for Object.entries and assignment logic
                Object.entries(userResponse.testAnswer).map(
                  ([qNo, ansData]) => {
                    if (
                      qNo == start_Test.test[start_Test?.activeQuestion].qcode
                    ) {
                      selectedAns = ansData.answer;
                      return;
                    }
                  }
                );

                return (
                  <div className="form-check m-1" key={index}>
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
                );
              })}
            </div>
          </div>
          <hr />
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
                    {start_Test?.activeQuestion ===
                    Object.keys(start_Test?.test).length - 1 ? (
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
                  <div className="col-6 col-md-3">
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary m-1"
                        onClick={() => handleBtnClicked("Previous")}
                      >
                        previous
                      </button>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <button
                      className="btn  btn-warning m-1"
                      onClick={() => handleBtnClicked("Mark&review")}
                      style={{ fontSize: "12px" }}
                    >
                      Mark for review
                    </button>
                  </div>

                  <div className="w-100"></div>

                  <div className="col-6 col-md-3">
                    <button
                      className="btn btn-sm btn-outline-primary m-1"
                      onClick={() => handleBtnClicked("Next")}
                    >
                      next
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
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
                </div>
                <div className="row">
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
  );
};

export default QuestionPaper;
