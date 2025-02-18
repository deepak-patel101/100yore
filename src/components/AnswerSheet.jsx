import React, { useEffect, useState, useTransition } from "react";
import { useTestContext } from "../Context/TestContext";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiTortoise } from "react-icons/gi";
import {
  FaThumbsUp,
  FaCheckCircle,
  FaAngleDoubleUp,
  FaAngleDoubleDown,
} from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { FaSheetPlastic } from "react-icons/fa6";
import "./css/Subject.css";
import QuestionFeedback from "./Feedback/QuestionFeedback";

const AnswerSheet = ({ userResponse }) => {
  // const { start_Test, userResponse, countDown } = useTestContext();
  const { start_Test } = useTestContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [giveFeedback, setGiveFeedback] = useState(false);
  const [hover, setHover] = useState(false);
  const [idForFeedBack, setIidForFeedBack] = useState(null);

  const [hoverKey, setHoverKey] = useState(false);
  let divBgColor = "C4C3C3";
  const style = {
    boxShadow: "5px 5px 10px rgba(0,0,0, 0.3)", // Shadow on bottom-right
    padding: "15px",
    marginBottom: "15px", // Adding some margin at the bottom for spacing
    borderRadius: "5px", // Adding border radius for rounded corners
    backgroundColor: "#ffffff", // Adding background color to the div
  };

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds} s`;
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  const handleFeedBackBtnClicked = (qcode) => {
    setGiveFeedback(!giveFeedback);
    setIidForFeedBack(qcode);
  };
  return (
    <div style={style}>
      <h5>
        <FaSheetPlastic /> Answer Sheet
      </h5>
      <div className="container">
        {start_Test?.test &&
          Object.entries(start_Test?.test).map(([QuestionNo, value]) => (
            <div className="parent" key={QuestionNo}>
              <div
                className="underline"
                onMouseEnter={() => {
                  setHover(true);
                  setHoverKey(QuestionNo);
                }}
                onMouseLeave={() => {
                  setHover(false);
                  setHoverKey(null);
                }}
                style={{}}
              >
                <div className="position-absolute top-0 end-0 translate-middle badge">
                  {userResponse &&
                    Object.entries(userResponse?.testAnswer).map(
                      ([qNo, ansData]) =>
                        qNo === QuestionNo && (
                          <div
                            key={qNo}
                            className="justify-content-center align-items-center text-center"
                            style={{
                              position: "relative",
                              zIndex: "2",
                              background: "white",
                              boxShadow: "5px 5px 10px rgba(0,0,0, 0.3)",
                              borderTopLeftRadius: "50%", // Add desired radius value here
                              borderTopRightRadius: "50%", // Add desired radius value here
                            }}
                          >
                            <div
                              className="justify-content-center align-items-center text-center"
                              style={{
                                height: "34px",
                                width: "34px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background:
                                  ansData.timeTaken < 15
                                    ? "radial-gradient(circle, #C9CE0F,#F6F7E1,  white)"
                                    : ansData.timeTaken > 15 &&
                                      ansData.timeTaken < 30
                                    ? "radial-gradient(circle, #0FB7CE,#E1F5F7,  white)"
                                    : "radial-gradient(circle, #B46C6C,#F7E1E1,  white)",
                              }}
                            >
                              {ansData.timeTaken < 15 ? (
                                <div
                                  style={{
                                    color: "yellow",
                                    fontSize: "22px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <AiFillThunderbolt />
                                </div>
                              ) : ansData.timeTaken > 15 &&
                                ansData.timeTaken < 30 ? (
                                <div
                                  style={{
                                    color: "#4D83F0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FaThumbsUp />
                                </div>
                              ) : (
                                <div
                                  className="justify-content-center align-items-center text-center"
                                  style={{
                                    fontSize: "25px",
                                    color: "red",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <GiTortoise />
                                </div>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "black" }}>
                              {convertSecondsToMinutesAndSeconds(
                                ansData.timeTaken
                              )}
                            </div>
                          </div>
                        )
                    )}
                </div>{" "}
                {/* {console.log(value.qcode)} */}
                {Object.entries(userResponse?.testAnswer).forEach(
                  ([qNo, ansData]) => {
                    if (userResponse?.testAnswer[value.qcode]) {
                      if (qNo == value.qcode) {
                        value?.options.forEach((option) => {
                          const correctAnswer = value?.answer
                            ?.toLowerCase()
                            .replace(/\s+/g, "");
                          const userAnswer = ansData?.answer
                            ?.toLowerCase()
                            .replace(/\s+/g, "");

                          if (correctAnswer === userAnswer) {
                            divBgColor = "B7EDB5";
                          } else if (!userAnswer) {
                            divBgColor = "C4C3C3";
                          } else {
                            divBgColor = "EDB5B5";
                          }
                        });
                      }
                    } else {
                      divBgColor = "C4C3C3";
                    }
                  }
                )}
                <div
                  className="row m-1 mb-4 p-2"
                  style={{
                    boxShadow:
                      QuestionNo === hoverKey && hover
                        ? "5px 5px 10px rgba(52,80,142, 0.5)"
                        : "5px 5px 10px rgba(0,0,0, 0.3)",
                    borderRadius: "10px",
                    background: `linear-gradient(to bottom, white,#${divBgColor})`,
                  }}
                >
                  <div className="col-10 d-flex">
                    <div className="d-flex">
                      Q {Number(QuestionNo) + 1} -{" "}
                      <div
                        dangerouslySetInnerHTML={{ __html: value?.question }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    {value?.options.map((option, index) => {
                      let borderStyle = "1px solid transparent";
                      let bgStyle = "transparent";
                      if (QuestionNo) {
                        borderStyle =
                          value?.answer?.toLowerCase().replace(/\s+/g, "") ===
                          option?.toLowerCase().replace(/\s+/g, "")
                            ? "1px solid #5AD95C"
                            : null;
                        bgStyle =
                          value?.answer?.toLowerCase().replace(/\s+/g, "") ===
                          option?.toLowerCase().replace(/\s+/g, "")
                            ? "rgba(90, 217, 92,0.5)"
                            : null;
                      }
                      Object.entries(userResponse?.testAnswer).forEach(
                        ([qNo, ansData]) => {
                          if (qNo === value?.qcode) {
                            borderStyle =
                              value?.answer
                                ?.toLowerCase()
                                .replace(/\s+/g, "") ===
                              option?.toLowerCase().replace(/\s+/g, "")
                                ? "1px solid #5AD95C"
                                : option?.toLowerCase().replace(/\s+/g, "") ===
                                  ansData?.answer
                                ? "1px solid #D95A5A"
                                : null;
                            bgStyle =
                              value?.answer
                                ?.toLowerCase()
                                .replace(/\s+/g, "") ===
                              option?.toLowerCase().replace(/\s+/g, "")
                                ? "rgba(90, 217, 92,0.5)"
                                : option?.toLowerCase().replace(/\s+/g, "") ===
                                  ansData?.answer
                                    ?.toLowerCase()
                                    .replace(/\s+/g, "")
                                ? "rgba(217, 90, 90,0.5)"
                                : null;
                          }
                        }
                      );

                      return (
                        <div
                          className="m-1"
                          key={index}
                          style={{
                            borderRadius: "10px",
                            border: borderStyle,
                            background: bgStyle,
                          }}
                        >
                          {bgStyle === "rgba(90, 217, 92,0.5)" ? (
                            <FaCheckCircle style={{ color: "#1CB30A" }} />
                          ) : bgStyle === "rgba(217, 90, 90,0.5)" ? (
                            <FiXCircle style={{ color: "#D20C0C" }} />
                          ) : (
                            <>&nbsp;&nbsp;&nbsp;</>
                          )}{" "}
                          {index + 1}- {option}
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {userResponse?.testAnswer[value?.qcode] ? (
                      <div>
                        {Object.entries(userResponse?.testAnswer).map(
                          ([qNo, ansData]) =>
                            qNo === value?.qcode && (
                              <div key={qNo}>
                                <hr />
                                <div>
                                  Your answer ={" "}
                                  {!ansData.answer ? "Skipped" : ansData.answer}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    ) : (
                      <div>
                        <hr />
                        Your answer = Not Attempted
                      </div>
                    )}
                  </div>

                  {/* ////// Objection ////// */}
                  <div>
                    <button
                      className="btn ms-1 me-1 btn-sm btn-outline-dark m-1"
                      onClick={() => handleFeedBackBtnClicked(value.qcode)}
                    >
                      Objection
                      {value.qcode === idForFeedBack && giveFeedback ? (
                        <FaAngleDoubleUp />
                      ) : (
                        <FaAngleDoubleDown />
                      )}
                    </button>

                    {value.qcode === idForFeedBack && giveFeedback ? (
                      <QuestionFeedback
                        questionData={value}
                        giveFeedback={giveFeedback}
                        setGiveFeedback={setGiveFeedback}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AnswerSheet;
