import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import { PiExamFill } from "react-icons/pi";
import { MdAutoDelete, MdOutlineErrorOutline } from "react-icons/md";

import Loading from "../Loading";
import { useNavigate } from "react-router-dom";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useUserContext } from "../../Context/UserContext";
import { fromPairs, slice } from "lodash";
import { FaFilePdf, FaLock, FaRecycle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

import { FaSheetPlastic } from "react-icons/fa6";
import { useTestContext } from "../../Context/TestContext";
import ExportToPDF from "../Dashboard/ExportToPDF";
import CircularProgressBar from "../CircularProgressBar";

const SelectOnGoingTest = ({ testType, bgColor, from, loadingFrom }) => {
  const { subject, SearchKeyWord } = useGlobalContext();
  const { user } = useUserContext();
  const [dtaToPass, setDataToPass] = useState(null);
  const [levelStats, setLevelStats] = useState({});
  const [totalAttInSet, setTotalAttInSet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDeletedQ, setShowDeletedQ] = useState(false);
  const [totalCorInSet, setTotalCorInSet] = useState(0);
  const [passingData, setPassingData] = useState([]);
  const [date, setdate] = useState(null);
  const [release, setRelease] = useState(false);
  const [filteredData, setFilteredData] = useState({});
  const [previewPdf, setPreviewPdf] = useState(false);
  const {
    test_loading,
    test_ongoing_data: temp_test_data,
    test_error,
    SetStartTestData,
  } = useTestContext();
  const [test_data, setTest_data] = useState(); // Initialize with temp_test_data
  const navigate = useNavigate();
  const startTest = (testDataToStartTest) => {
    SetStartTestData(testDataToStartTest);
    navigate("/TestSeries/Start-Test");
  };
  useEffect(() => {
    setTest_data(temp_test_data);
  }, [SearchKeyWord, subject, temp_test_data]);
  console.log(test_data, temp_test_data);
  const fetchTestInfo = async () => {
    setLoading(true);
    if (from === "search") {
      try {
        const response = await fetch(
          `https://railwaymcq.com/railwaymcq/RailPariksha/Searched_Mcq_Sets.php?user_id=${user?.id}&search_keyword=${SearchKeyWord}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLoading(false);
        setTest_data(data); // Update test_data only when from is "search"
      } catch (error) {
        setLoading(false);
        console.error("Error fetching SUBJECT_MASTER info:", error);
      }
    }
  };

  useEffect(() => {
    setLoading(loadingFrom);
  }, [loadingFrom]);
  useEffect(() => {
    setLoading(test_loading);
  }, [test_loading]);
  useEffect(() => {
    if (from === "search") {
      fetchTestInfo();
    } else setTest_data(temp_test_data);
  }, [from]);
  // console.log(test_data);
  useEffect(() => {
    if (test_data) {
      const levelState = {};

      Object.entries(test_data).forEach(([level, sets]) => {
        let levelAttempted = 0;
        let levelCorrect = 0;

        levelState[level] = {
          totalAttempted: 0,
          totalCorrect: 0,
          sets: {},
        };

        Object.entries(sets).forEach(([setName, ques]) => {
          let array;
          if (from === "customSets `remove this`") {
            array = ques.questions;
          } else {
            array = ques;
          }

          let setAttempted = 0;
          let setCorrect = 0;
          array?.forEach((question) => {
            if (question.user_response.attempted) {
              setAttempted += 1;
              levelAttempted += 1;
            }
            if (question.user_response.correct) {
              setCorrect += 1;
              levelCorrect += 1;
            }
          });

          levelState[level].sets[setName] = {
            totalAttempted: setAttempted,
            totalCorrect: setCorrect,
          };
        });

        levelState[level].totalAttempted = levelAttempted;
        levelState[level].totalCorrect = levelCorrect;
      });
      setLevelStats(levelState);
    }
  }, [test_data]);

  useEffect(() => {
    setTotalAttInSet(levelStats[testType]?.totalAttempted);
    setTotalCorInSet(levelStats[testType]?.totalCorrect);
  }, [levelStats, testType]);
  ///////////////////  CUSTOM SETS ///////////////////////////////////////////////////////////////////
  const fetchTestInfoCustom = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_Custom_Sets.php?user_id=${user?.id}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setLoading(false);
      setTest_data(data); // Update test_data only when from is "search"
    } catch (error) {
      setLoading(false);
      console.error("Error fetching SUBJECT_MASTER info:", error);
    }
  };

  useEffect(() => {
    if (from === "customSets") {
      fetchTestInfoCustom();
    }
  }, [from]);
  const handleDelete = async (name, action) => {
    // Show a confirmation dialog to the user
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the set "${name}"? Once deleted set cannot be recovered`
    );

    // If the user clicks "Cancel", exit the function
    if (!isConfirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("set_name", name);
    formData.append("action", action);

    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/MCQTown/delete_custom_set.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      fetchTestInfoCustom();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePDF = (setNo, test) => {
    // console.log(setNo, test);
    setPreviewPdf(!previewPdf);
    setPassingData([setNo, test]);
  };
  // useEffect(() => {
  //   let date =
  //     test_data?.easy[Object.keys(test_data?.easy)[0]][0]?.release_date;
  //   setReleaseDate(date);
  // }, [releaseDate]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add 1 because months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    setdate(`${year}-${month}-${day}`);
  }, [test_data]);
  const handleAnsSheet = (test) => {
    SetStartTestData({
      set: test,
      timing: test.length / 2,
    });
    const data = {
      set_No: test[0].set_No,
      user_id: user?.id,
      topcode: subject.selectedTopicCode,
      subcode: subject.subjectCode,
    };
    navigate("/TestSeries/Answer_Sheet", {
      state: { data },
    });
  };
  useEffect(() => setFilteredData(temp_test_data), [temp_test_data]);

  useEffect(() => {
    const filterByDate = (data) => {
      if (from === "HOME") {
        const today = new Date().toISOString().split("T")[0];

        // Create a deep copy of the data to avoid mutation
        const filtered = {
          ...data,
          easy: Object.entries(data.easy || {}).reduce((acc, [key, items]) => {
            const filteredItems = items.filter((item) =>
              item.releaseDate?.startsWith(today)
            );
            if (filteredItems.length) acc[key] = filteredItems;
            return acc;
          }, {}),
        };

        return filtered;
      }
      return data;
    };
    if (filteredData?.easy) {
      setTest_data(filterByDate(filteredData));
    }
  }, [filteredData, from]);

  return (
    <div className="row ">
      {/* //////////////////////////PDF PREVIEW (CURRENTLY FOR CUSTOM SETS)///////////////////////// */}
      {previewPdf && (
        <div
          style={{
            margin: "0",
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw",
            zIndex: 10,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setPreviewPdf(false)}
        >
          <div
            className="position-relative p-2 "
            style={{
              boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
              background: "white",
              borderRadius: "15px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className=" position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
              style={{
                height: "20px",
                width: "20px",
                cursor: "pointer",
                background: "white",
                borderRadius: "50%",
                zIndex: 10,
              }}
              onClick={() => setPreviewPdf(false)}
            >
              <IoCloseCircleSharp
                style={{
                  color: "red",
                  boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <ExportToPDF data={passingData} />
          </div>
        </div>
      )}
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

                          {from === "HOME"
                            ? `We don not have any test for ${subject?.department} today`
                            : " No Tests Found"}
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
                            <div>
                              keep practicing
                              {from === "customSets remove" ? (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-dashboard">
                                      Restore Deleted sets
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    style={{ fontSize: "12px" }}
                                    className="btn btn-outline-success Subject"
                                    onClick={() => setShowDeletedQ(true)}
                                  >
                                    <FaRecycle />
                                  </button>
                                </OverlayTrigger>
                              ) : null}
                            </div>
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
                                let TestTiming = releaseDate
                                  ? `${releaseDate.slice(11, 16)} to ${
                                      Number(releaseDate.slice(11, 13)) + 1
                                    }${releaseDate.slice(13, 16)}
 `
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
                                          .released ? null : user?.login_type ===
                                            "admin" || user?.name === "new" ? (
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
                                                {test[0].testHappened ? (
                                                  <div>
                                                    {" "}
                                                    <h6>
                                                      Test was held on{" "}
                                                      {releaseDate
                                                        ? formattedDate
                                                        : "Invalid Date"}{" "}
                                                      o'Clock
                                                      <hr />
                                                      <p>
                                                        Test will be unlock
                                                        tomorrow
                                                      </p>
                                                      <p>
                                                        Answer sheet will be
                                                        available 2 hours after
                                                        closure of the test
                                                        portal
                                                      </p>
                                                    </h6>
                                                    {hasAttempted &&
                                                    test[0].testHappened &&
                                                    test[0].ansKey_release ? (
                                                      <div
                                                        style={{
                                                          fontSize: "12px",
                                                        }}
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
                                        {from === "customSets" ? (
                                          <div className="d-flex position-absolute translate-middle top-0 start-100 pe-2 ">
                                            <div className="me-1">
                                              <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                  <Tooltip id="tooltip-dashboard">
                                                    Save as PDF
                                                  </Tooltip>
                                                }
                                              >
                                                <div
                                                  onClick={() =>
                                                    handlePDF(setNo, test)
                                                  }
                                                  className=" badge rounded-pill bg-primary "
                                                >
                                                  <FaFilePdf />
                                                </div>
                                              </OverlayTrigger>
                                            </div>
                                            <div className="me-1">
                                              <OverlayTrigger
                                                placement="bottom"
                                                overlay={
                                                  <Tooltip id="tooltip-dashboard">
                                                    Delete this set
                                                  </Tooltip>
                                                }
                                              >
                                                <div
                                                  onClick={() =>
                                                    handleDelete(
                                                      setNo,
                                                      "delete"
                                                    )
                                                  }
                                                  className=" badge rounded-pill bg-danger "
                                                >
                                                  <MdAutoDelete />
                                                </div>
                                              </OverlayTrigger>
                                            </div>
                                            {/*  */}
                                          </div>
                                        ) : null}
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
                                                  style={{ fontSize: "11px" }}
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
                                                    {" "}
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

                                                  {test[0].released &&
                                                  !test[0].testHappened ? (
                                                    <li>
                                                      <h6>
                                                        {" "}
                                                        Test Timing {TestTiming}
                                                      </h6>
                                                    </li>
                                                  ) : (
                                                    <li>
                                                      Test was held on{" "}
                                                      {formattedDate}
                                                    </li>
                                                  )}

                                                  <hr />
                                                </ul>
                                              </div>
                                            </div>
                                            <div className="container text-center">
                                              <div className="row">
                                                <div
                                                  style={{ fontSize: "12px" }}
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
                                                test[0].testHappened &&
                                                test[0].ansKey_release ? (
                                                  <div
                                                    style={{ fontSize: "12px" }}
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

export default SelectOnGoingTest;
