import React, { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { LuAlarmClock } from "react-icons/lu";
import { useTestContext } from "../Context/TestContext";
import { MdDelete, MdOutlineQuestionAnswer } from "react-icons/md";
import { BsDisplay } from "react-icons/bs";
import { useUserContext } from "../Context/UserContext";
import { GiConsoleController } from "react-icons/gi";
import Loading from "./Loading";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GrUpdate } from "react-icons/gr";

const TestControls = () => {
  const { user } = useUserContext();
  const [mint, setMint] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [loading, serLoading] = useState(false);
  const [sec, setSec] = useState(null);
  const [qcode, setQcode] = useState(null);
  const { subject } = useGlobalContext();
  const { start_Test, updateActiveQuestion, countDown, userResponse } =
    useTestContext();
  const [questionIndex, setQuestionIndex] = useState(0);
  const style = {
    boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
  };
  useEffect(() => {
    setQcode(start_Test.test[start_Test.activeQuestion].qcode);
  }, [start_Test]);
  const btn = {
    boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
    borderRadius: "5px",
  };
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
  const handleClick = (data) => {
    updateActiveQuestion(data);
  };

  useEffect(() => {
    const qIndex = Math.min(
      Number(start_Test.activeQuestion) + 1,
      Object.keys(start_Test.test).length
    );
    setQuestionIndex(qIndex - 1);
  }, [start_Test.activeQuestion]);

  const timeStringToSeconds = (timeString) => {
    if (!timeString) return 0;
    const [minutes, seconds] = timeString.split(":").map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 0;
    return minutes * 60 + seconds;
  };

  const countDownTimerChange = (countdownTime) => {
    if (!countdownTime) return;
    const [minutes, seconds] = countdownTime.split(":").map(Number);
    if (isNaN(minutes) || isNaN(seconds)) {
      setMint(0);
      setSec("00");
      return;
    }
    setMint(minutes);
    setSec(seconds < 10 ? `0${seconds}` : seconds.toString());
  };

  useEffect(() => {
    countDownTimerChange(countDown.remainingTime);
  }, [countDown.remainingTime]);

  const percentage =
    (timeStringToSeconds(countDown.remainingTime) /
      Number(countDown.testTiming * 3600)) *
    100;
  const interpolateColor = (percentage) => {
    const r = Math.round(255 * (1 - percentage));
    const g = Math.round(255 * percentage);
    return `linear-gradient(to bottom, white, rgba(${r}, ${g}, 0, 0.5))`;
  };

  const backgroundColor = interpolateColor(percentage);
  const handleFetchFeedback = async () => {
    serLoading(true);
    setError(""); // Clear previous errors
    setFeedback([]); // Clear previous feedback

    if (!qcode) {
      setError("error While geting Qcode");
      return;
    }

    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/Feedback_on_Qcode.php?qcode=${qcode}`
      );
      const data = await response.json();
      serLoading(false);
      if (response.ok) {
        if (data.length > 0) {
          setFeedback(data);
        } else {
          setError("No feedback found for this qcode");
        }
      } else {
        setError(data.error || "An error occurred while fetching data");
      }
    } catch (err) {
      serLoading(false);
      setError("Error fetching data");
    }
  };

  useEffect(() => {
    handleFetchFeedback();
  }, [qcode]);
  const handleUpdateFeedback = async (feedbackId) => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/UpdateFeedback.php?feedbackid=${feedbackId}`
      );

      if (response.ok) {
        handleFetchFeedback(); // Refresh the feedback list after updating
      } else {
        setError("Error updating feedback");
      }
    } catch (err) {
      setError("Error updating feedback");
    }
  };
  const handleDeleteFeedback = async (feedbackId) => {
    // Ask for confirmation
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (userConfirmed) {
      try {
        const response = await fetch(
          `https://railwaymcq.com/railwaymcq/RailPariksha/DeleteFeedback.php?feedbackid=${feedbackId}`
        );

        if (response.ok) {
          handleFetchFeedback(); // Refresh the feedback list after deleting
        } else {
          setError("Error deleting feedback");
        }
      } catch (err) {
        setError("Error deleting feedback");
      }
    }
  };
  const resCode1Array = feedback.filter((item) => item.res_code === 1);
  const resCode0Array = feedback.filter((item) => item.res_code === 0);
  return (
    <div className="container">
      <div className="row m-1" style={style}>
        <h4>{subject.department} </h4>
        <h6>{subject.subject}</h6>
      </div>
      {user.login_type === "admin" ? (
        <div></div>
      ) : (
        <div className="row " style={style}>
          <h5>
            <LuAlarmClock /> Test Timer <hr />
          </h5>
          {user.login_type !== "admin" && (
            <div
              className=""
              style={{
                background: backgroundColor,
                borderRadius: "5px",
              }}
            >
              <CountdownTimer className="visually-hidden" />
              <h1>{/* {mint}:{sec} */}</h1>
              <h2>{countDown.remainingTime}</h2>
            </div>
          )}
        </div>
      )}

      <div className="row m-1" style={style}>
        <h5>
          <MdOutlineQuestionAnswer /> Questions <hr />
        </h5>
        <div className="d-flex flex-wrap justify-content-center align-items-center text-center">
          {Object.entries(start_Test?.test).map(([key, value], index) => {
            let buttonClass = "outline-dark";

            if (value.activeQuestionStatus === "Mark&review") {
              buttonClass = "warning";
            } else if (value.activeQuestionStatus === "Next") {
              buttonClass = "danger";
            } else if (value.activeQuestionStatus) {
              buttonClass = "success";
            }

            return (
              <div key={index} className="col-sm-2 col-md-2 text-center ">
                <button
                  style={questionIndex === Number(key) ? btn : {}}
                  className={`btn-sm btn btn-${buttonClass} ${
                    questionIndex === Number(key) ? "rounded-3" : ""
                  } w-100`}
                  onClick={() => handleClick(key)}
                >
                  {Number(key) + 1}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {user.login_type === "admin" ? (
        <div className="container papaDiv ">
          <h5> Feedbacks</h5>{" "}
          <div>
            <hr />
            {loading ? <Loading /> : null}
            {feedback.length === 0 && !loading ? (
              "No feedback For this Question"
            ) : (
              <div className="mt-1">
                <div style={{ border: "1px solid red", borderRadius: "5px" }}>
                  <div style={{ background: "#ee4729", color: "white" }}>
                    <b>Not Responded yet</b>
                  </div>
                  <div
                    className=" scrollspy-example-2"
                    style={{
                      overflow: "auto",
                      maxHeight: "225px",
                      background: "#f2cfc6", //
                    }}
                  >
                    {resCode0Array?.map((feedbackObj, index) => {
                      return (
                        <div key={index}>
                          <div className="d-flex m-1 justify-content-between">
                            {index + 1}- {feedbackObj?.feedback}
                            <div>
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="tooltip-dashboard">
                                    move to not responded yet
                                  </Tooltip>
                                }
                              >
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => {
                                    handleUpdateFeedback(feedbackObj?.f_id);
                                  }}
                                >
                                  <GrUpdate />
                                </button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="tooltip-dashboard">
                                    Delete
                                  </Tooltip>
                                }
                              >
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    handleDeleteFeedback(feedbackObj.f_id);
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </OverlayTrigger>
                            </div>{" "}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr />
                <div style={{ border: "1px solid green", borderRadius: "5px" }}>
                  <div style={{ background: "#1cb73d", color: "white" }}>
                    <b>Responded</b>{" "}
                  </div>
                  <div
                    className=" scrollspy-example-2"
                    style={{
                      overflow: "auto",
                      maxHeight: "125px",
                      background: "#c6f2d9", //150, 241, 128
                    }}
                  >
                    {resCode1Array?.map((feedbackObj, index) => {
                      return (
                        <div key={index} className="">
                          {feedbackObj?.res_code === 1 ? (
                            <div className="d-flex m-1 justify-content-between">
                              {index + 1}- {feedbackObj?.feedback}
                              <div>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-dashboard">
                                      move to not responded yet
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => {
                                      handleUpdateFeedback(feedbackObj?.f_id);
                                    }}
                                  >
                                    <GrUpdate />
                                  </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-dashboard">
                                      Delete
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      handleDeleteFeedback(feedbackObj.f_id);
                                    }}
                                  >
                                    <MdDelete />
                                  </button>
                                </OverlayTrigger>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {screenSize.width > 770 ? (
            <div className="row container m-1" style={style}>
              Note-
              <hr />
              <div className="row">
                <div className="col">
                  <button className="btn btn-sm btn-outline-dark">
                    Not visited
                  </button>
                </div>
                <div className="col">
                  <button className="btn btn-sm btn-danger">
                    Not attempted
                  </button>
                </div>
                <div className="w-100"></div>
                <div className="col">
                  <button className="btn btn-sm btn-warning">
                    Marked for review
                  </button>
                </div>
                <div className="col">
                  <button className="btn btn-sm btn-success">
                    Answer Saved
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TestControls;
