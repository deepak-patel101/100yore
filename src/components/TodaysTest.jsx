import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { useTestContext } from "../Context/TestContext";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { MdOutlineErrorOutline } from "react-icons/md";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CircularProgressBar from "./CircularProgressBar";
import { FaSheetPlastic } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { PiExamFill } from "react-icons/pi";

const TodaysTest = ({ testType, bgColor, from, loadingFrom }) => {
  const { subject } = useGlobalContext();
  const { user } = useUserContext();
  const { temp_test_data, test_loading, SetStartTestData } = useTestContext();
  const [levelStats, setLevelStats] = useState({});
  const [totalAttInSet, setTotalAttInSet] = useState(0);
  const [totalCorInSet, setTotalCorInSet] = useState(0);
  const [filteredData, setFilteredData] = useState({});
  const [test_data, setTest_data] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startTest = (testDataToStartTest) => {
    SetStartTestData(testDataToStartTest);
    navigate("/TestSeries/Start-Test");
  };

  useEffect(
    () => setLoading(loadingFrom || test_loading),
    [loadingFrom, test_loading]
  );

  useEffect(() => {
    if (test_data) {
      const calculateStats = (data) => {
        const stats = {};
        Object.entries(data).forEach(([level, sets]) => {
          let totalAttempted = 0;
          let totalCorrect = 0;

          stats[level] = { totalAttempted: 0, totalCorrect: 0, sets: {} };
          Object.entries(sets).forEach(([setName, questions]) => {
            let setAttempted = 0;
            let setCorrect = 0;

            questions?.forEach((question) => {
              if (question.user_response?.attempted) setAttempted++;
              if (question.user_response?.correct) setCorrect++;
            });

            stats[level].sets[setName] = {
              totalAttempted: setAttempted,
              totalCorrect: setCorrect,
            };
            totalAttempted += setAttempted;
            totalCorrect += setCorrect;
          });

          stats[level].totalAttempted = totalAttempted;
          stats[level].totalCorrect = totalCorrect;
        });

        return stats;
      };

      setLevelStats(calculateStats(test_data));
    }
  }, [test_data]);

  useEffect(() => {
    setTotalAttInSet(levelStats[testType]?.totalAttempted || 0);
    setTotalCorInSet(levelStats[testType]?.totalCorrect || 0);
  }, [levelStats, testType]);

  useEffect(() => setFilteredData(temp_test_data), [temp_test_data]);

  const handleAnsSheet = (test) => {
    SetStartTestData({ set: test, timing: test.length / 2 });
    navigate("/TestSeries/Answer_Sheet", {
      state: {
        data: {
          set_No: test[0]?.set_No,
          user_id: user?.id,
          topcode: subject.selectedTopicCode,
          subcode: subject.subjectCode,
        },
      },
    });
  };

  console.log(); // Check the filtered data in console

  return (
    <div className="row ">
      {/* //////////////////////////PDF PREVIEW (CURRENTLY FOR CUSTOM SETS)///////////////////////// */}

      {/* ///////////////////////////////////////////////////////////////////////////////////////////// */}
      {loading ? (
        <h6>
          loading tests <Loading />
        </h6>
      ) : (
        <div>
          {test_data ? (
            <div>
              {Object.entries(test_data).map(([key, value]) => {
                let totalQuestions = 0;

                // let value;
                // if (from === "customSets") {
                //   value = val.questions;
                // } else {
                //   value = val;
                // }
                // console.log(key, value);
                for (const set in value) {
                  totalQuestions += value[set].length;
                }
                let attPer = (totalAttInSet / totalQuestions) * 100;
                let corPer = (totalCorInSet / totalAttInSet) * 100;
                let wroPer =
                  ((totalAttInSet - totalCorInSet) / totalAttInSet) * 100;

                if (key === testType) {
                  return (
                    <div key={key}>
                      {Object.keys(value).length === 0 ? (
                        <h5 style={{ color: "red" }}>
                          <MdOutlineErrorOutline />
                          We Don`t Have Any Tests Today
                        </h5>
                      ) : (
                        <div>
                          <div
                            className="d-flex justify-content-around  ms-2 me-2 papaDiv"
                            style={{ maxHeight: "65px" }}
                          >
                            <div>
                              <div>
                                Total {Object.keys(value).length} Sets,&nbsp;
                              </div>
                              <div> {totalQuestions} Questions</div>
                            </div>

                            {/* ////////////////////////////////////////////////////////////////////////// */}
                            <div className="text-center">
                              <div className="d-flex justify-content-between ">
                                <div className="me-2">
                                  {/* Attempted-//////////////////////////////// */}
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        You Attempted {totalAttInSet} Question,
                                        out of {totalQuestions} Questions .
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="d-flex align-item-center"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <CircularProgressBar
                                        data={attPer}
                                        size="35px"
                                        primary="#0378cf"
                                        secondary="#e1f0ff"
                                      />
                                    </div>
                                  </OverlayTrigger>
                                  <div style={{ fontSize: "11px" }}>
                                    {totalAttInSet}
                                  </div>
                                </div>
                                <div className="">
                                  {/* correct - ///////////////////////////////////////////////// */}
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        You marked {totalCorInSet} Correct out
                                        of {totalAttInSet} Attempted Questions
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="d-flex align-item-center"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <CircularProgressBar
                                        data={corPer}
                                        size="35px"
                                        primary="#0fcf03"
                                        secondary="#e8ffe1"
                                      />
                                    </div>
                                  </OverlayTrigger>
                                  <div style={{ fontSize: "11px" }}>
                                    {totalCorInSet}
                                  </div>
                                </div>
                                <div className="ms-2">
                                  {/* Incorrect - //////////////////////////// */}
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        You marked{" "}
                                        {totalAttInSet - totalCorInSet} Wrong
                                        out of {totalAttInSet}
                                        Attempted Questions
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="d-flex align-item-center"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <CircularProgressBar
                                        data={wroPer}
                                        size="35px"
                                        primary="#ff6347"
                                        secondary="#ffe4e1"
                                      />
                                    </div>
                                  </OverlayTrigger>
                                  <div style={{ fontSize: "11px" }}>
                                    {totalAttInSet - totalCorInSet}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* ////////////////////////////////////////////////////////////////////////// */}
                            <div>keep practicing</div>
                          </div>

                          <div
                            className="row overflow-auto "
                            style={{
                              maxHeight: "450px", // Set a fixed height for the container
                              overflowY: "auto", // Enable vertical scrolling
                            }}
                          >
                            {Object.entries(value).map(
                              ([setNo, test], index) => {
                                let setUserData =
                                  levelStats[testType]?.sets[setNo];
                                let attemptedQ = setUserData?.totalAttempted;
                                let correctedQ = setUserData?.totalCorrect;
                                let hasAttempted = test.some(
                                  (test) => test.user_response.attempted
                                );

                                let attPer = (attemptedQ / test.length) * 100;
                                let corPer = (correctedQ / attemptedQ) * 100;
                                let wroPer =
                                  ((attemptedQ - correctedQ) / attemptedQ) *
                                  100;
                                let releaseDate = test[0]?.release_date;

                                const formattedDate = releaseDate
                                  ? `
                                  ${releaseDate.slice(
                                    8,
                                    10
                                  )}/${releaseDate.slice(
                                      5,
                                      7
                                    )}/${releaseDate.slice(0, 4)} at
                                  ${releaseDate.slice(11, 16)}`
                                  : "Invalid Date";
                                return (
                                  <div
                                    key={index}
                                    className="  col-md-3 mb-3"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    <div
                                      className="card Subject underline mt-1 "
                                      style={{
                                        background: `linear-gradient(to bottom, white,${bgColor})`,
                                        margin: "0px",
                                        padding: "0px",
                                        height: "100%", // Make sure the card fills its container
                                      }}
                                    >
                                      <div className="card-body  ">
                                        {test[0]
                                          ?.released ? null : user?.login_type ===
                                          "admin" ? (
                                          <div
                                            className=" text-center"
                                            style={{
                                              border: "2px red solid",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {" "}
                                            release date =
                                            {releaseDate
                                              ? formattedDate
                                              : "Invalid Date"}
                                          </div>
                                        ) : (
                                          <div
                                            className="position-absolute start-0 top-0"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              background: "rgba(0, 0, 0, 0.7)",
                                              zIndex: 10,
                                            }}
                                          >
                                            {" "}
                                            {/* Centered container */}
                                            <div
                                              className="position-absolute top-50 start-50 translate-middle"
                                              style={{
                                                transform: "rotate(45deg)",
                                                width: "100%",
                                                alignItems: "center",
                                              }}
                                            >
                                              <div className=" text-center">
                                                <h3
                                                  style={{
                                                    color: "white",
                                                    width: "100%",
                                                  }}
                                                >
                                                  {subject.selectedTopic}
                                                </h3>
                                                <h6
                                                  style={{
                                                    color: "white",
                                                    width: "100%",
                                                  }}
                                                >
                                                  set-{setNo}
                                                </h6>
                                              </div>

                                              <div
                                                className="row m-2 text-center"
                                                style={{
                                                  color: "white",
                                                  // justifyContent: "center",
                                                  width: "100%",
                                                }}
                                              >
                                                {test[0]?.testHappened ? (
                                                  <div>
                                                    {" "}
                                                    <h6>
                                                      test was held on{" "}
                                                      {releaseDate
                                                        ? formattedDate
                                                        : "Invalid Date"}{" "}
                                                      o'Clock
                                                      <br />
                                                      test will be unlock
                                                      yesterday
                                                    </h6>
                                                    {hasAttempted &&
                                                    test[0]?.testHappened ? (
                                                      <div
                                                        onClick={() => {
                                                          handleAnsSheet(test);
                                                        }}
                                                        className={`col btn btn-outline-${
                                                          testType === "easy"
                                                            ? "light"
                                                            : testType ===
                                                              "tough"
                                                            ? "danger"
                                                            : testType ===
                                                              "moderate"
                                                            ? "info"
                                                            : testType ===
                                                              "random"
                                                            ? "warning"
                                                            : "danger"
                                                        } m-1`}
                                                      >
                                                        <FaSheetPlastic />
                                                        Answer sheet
                                                      </div>
                                                    ) : null}
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      test will be unlock on
                                                    </h6>
                                                    <h6> {formattedDate}</h6>
                                                    <h6>for 1 hours</h6>
                                                  </div>
                                                )}
                                              </div>

                                              {/* Inner content */}
                                              <div
                                                style={{
                                                  width: "100%",
                                                  background: "white",
                                                  display: "flex",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <div
                                                  className="d-flex justify-content-center align-items-center mt-1 mb-1"
                                                  style={{
                                                    background: "#e33636",
                                                    color: "white",
                                                    padding: "10px",
                                                    width: "100%",
                                                    borderRadius: "5px",
                                                  }}
                                                >
                                                  <FaLock />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {/* {" "}////////////// buttons for pdf and delete custom sets test/////// */}

                                        <div className="d-flex position-relative justify-content-between">
                                          <div
                                            className="text-muted"
                                            style={{
                                              fontSize: "14px",
                                              marginBottom: "0",
                                              paddingTop: "0px",
                                            }}
                                          >
                                            {from === "customSets"
                                              ? "Custom set"
                                              : subject.department}
                                          </div>
                                          {setNo === "1" ? (
                                            <div style={{ fontSize: "14px" }}>
                                              Mock Test
                                            </div>
                                          ) : null}
                                          <div style={{ fontSize: "14px" }}>
                                            set-{setNo}
                                          </div>
                                        </div>
                                        {/* ////////////////////////////////////////////////////////////////////////// */}
                                        <div
                                          className="text-center"
                                          style={{
                                            margin: "0px",
                                            padding: "0px",
                                          }}
                                        >
                                          <div style={{ fontSize: "12px" }}>
                                            Set Record
                                          </div>
                                          <div
                                            className="d-flex justify-content-evenly "
                                            style={{
                                              margin: "0px",
                                              padding: "0px",
                                            }}
                                          >
                                            <div className="mt-1 pb-0">
                                              {/* Attempted-//////////////////////////////// */}
                                              <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                  <Tooltip id="tooltip-dashboard">
                                                    You Attempted {attemptedQ}{" "}
                                                    Question, out of{" "}
                                                    {test.length} Questions .
                                                  </Tooltip>
                                                }
                                              >
                                                <div
                                                  className="d-flex align-item-center"
                                                  style={{ fontSize: "15px" }}
                                                >
                                                  <CircularProgressBar
                                                    data={attPer}
                                                    size="30px"
                                                    primary="#0378cf"
                                                    secondary="#e1f0ff"
                                                  />
                                                </div>
                                              </OverlayTrigger>
                                              <div style={{ fontSize: "11px" }}>
                                                {attemptedQ}
                                              </div>
                                            </div>
                                            <div className="mt-1 pb-0">
                                              {/* correct - ///////////////////////////////////////////////// */}
                                              <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                  <Tooltip id="tooltip-dashboard">
                                                    You marked {correctedQ}{" "}
                                                    Correct out of {attemptedQ}{" "}
                                                    Attempted Questions
                                                  </Tooltip>
                                                }
                                              >
                                                <div
                                                  className="d-flex align-item-center"
                                                  style={{ fontSize: "15px" }}
                                                >
                                                  <CircularProgressBar
                                                    data={corPer}
                                                    size="30px"
                                                    primary="#0fcf03"
                                                    secondary="#e8ffe1"
                                                  />
                                                </div>
                                              </OverlayTrigger>
                                              <div style={{ fontSize: "11px" }}>
                                                {correctedQ}
                                              </div>
                                            </div>
                                            <div className="mt-1 pb-0">
                                              {/* Incorrect - //////////////////////////// */}
                                              <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                  <Tooltip id="tooltip-dashboard">
                                                    You marked{" "}
                                                    {attemptedQ - correctedQ}{" "}
                                                    Wrong out of {attemptedQ}
                                                    Attempted Questions
                                                  </Tooltip>
                                                }
                                              >
                                                <div
                                                  className="d-flex align-item-center"
                                                  style={{ fontSize: "15px" }}
                                                >
                                                  <CircularProgressBar
                                                    data={wroPer}
                                                    size="30px"
                                                    primary="#ff6347"
                                                    secondary="#ffe4e1"
                                                  />
                                                </div>
                                              </OverlayTrigger>
                                              <div style={{ fontSize: "11px" }}>
                                                {attemptedQ - correctedQ}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* ////////////////////////////////////////////////////////////////////////// */}
                                        <div className="row">
                                          <div className="col-12 col-sm-12">
                                            <div className="container text-center">
                                              <div className="row pb-1">
                                                <ul
                                                  className="col m-1 text-start"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  <hr />
                                                  {from === "customSets" ? (
                                                    <li>
                                                      Description - about{" "}
                                                    </li>
                                                  ) : (
                                                    <div>
                                                      <li>
                                                        Subject -{" "}
                                                        {subject.subject}
                                                      </li>
                                                      <li>
                                                        Topic -{" "}
                                                        {subject.selectedTopic}
                                                      </li>
                                                    </div>
                                                  )}
                                                  <li>
                                                    Question - {test.length}
                                                  </li>
                                                  <li>
                                                    Language - English ,
                                                    Hindi... etc
                                                  </li>
                                                  <li>
                                                    Difficulty -{" "}
                                                    {/* {testType === "easy"
                                                      ? "Easy"
                                                      : testType === "tough"
                                                      ? "Tough"
                                                      : testType === "moderate"
                                                      ? "Moderate"
                                                      : "Mixed"} */}
                                                  </li>
                                                  <li>
                                                    Quiz Time -{" "}
                                                    {`${test.length / 2}:00`}
                                                  </li>
                                                  <hr />
                                                </ul>
                                              </div>
                                            </div>
                                            <div className="container text-center">
                                              <div className="row">
                                                <div
                                                  onClick={() =>
                                                    startTest({
                                                      set: test,
                                                      timing: test.length / 2,
                                                    })
                                                  }
                                                  className={`col btn btn-outline-${
                                                    testType === "easy"
                                                      ? "success"
                                                      : testType === "tough"
                                                      ? "danger"
                                                      : testType === "moderate"
                                                      ? "info"
                                                      : testType === "random"
                                                      ? "warning"
                                                      : "danger"
                                                  } m-1`}
                                                >
                                                  <PiExamFill /> Start Test
                                                </div>
                                              </div>
                                            </div>
                                            <div className="container text-center">
                                              <div className="row">
                                                {hasAttempted &&
                                                test[0]?.testHappened ? (
                                                  <div
                                                    onClick={() => {
                                                      handleAnsSheet(test);
                                                    }}
                                                    className={`col btn btn-outline-${
                                                      testType === "easy"
                                                        ? "success"
                                                        : testType === "tough"
                                                        ? "danger"
                                                        : testType ===
                                                          "moderate"
                                                        ? "info"
                                                        : testType === "random"
                                                        ? "warning"
                                                        : "danger"
                                                    } m-1`}
                                                  >
                                                    <FaSheetPlastic />
                                                    Answer sheet
                                                  </div>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : test_data === undefined ? (
            ""
          ) : (
            <h3 style={{ color: "red" }}>Something went wrong </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default TodaysTest;
