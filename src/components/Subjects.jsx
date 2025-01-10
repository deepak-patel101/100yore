import React, { useState, useEffect } from "react";
import "./css/Subject.css";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaBook,
  FaCopy,
} from "react-icons/fa";
import { PiExamFill } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { IoCloseCircleSharp, IoHeart, IoHeartDislike } from "react-icons/io5";
import NotesReader from "./NotesReader";
import { useTestContext } from "../Context/TestContext";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { VscReferences } from "react-icons/vsc";
import {
  MdDomainVerification,
  MdRoomPreferences,
  MdVisibility,
} from "react-icons/md";
import CircularProgressBar from "./CircularProgressBar";
import Loading from "./Loading";
import SubjectCompElement from "./SubjectCompElement";
import BirdSprite from "./BirdSprite";
import { AiFillEyeInvisible } from "react-icons/ai";

const Subjects = ({ from }) => {
  const {
    subject,
    setSubject,
    notes,
    selected: department,
  } = useGlobalContext();
  const { user } = useUserContext();
  const { setDefaultActiveBtn } = useTestContext();
  const [notesBtnClicked, setNotesBtnClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchedDepartData, setFetchedDepartData] = useState();
  // const [totalAttQuestion, setTotalAttQuestion] = useState(0);
  // const [totalCorQuestion, setTotalCorQuestion] = useState(0);
  // const [totalWroQuestion, setTotalWroQuestion] = useState(0);
  const [data, setData] = useState(department);
  const [displayData, setDisplayData] = useState();
  const [hiddenDisplayData, setHiddenDisplayData] = useState({});
  const [showHiddenSubject, setShowHiddenSubject] = useState(false);

  const subjectList = department?.subjects;

  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(1);

  const messages = [
    "Fetching the data",
    "Getting your test record",
    "Please wait, it's taking more than usual",
    "Do you Know - 'More information doesn’t always mean more learning'",
    "Do you Know - 'Making mistakes are an essential part of learning'",
    "Do you Know - 'Emotions influence our ability to learn'",
    "Do you Know - 'Social interaction is good for learning'",
    "Do you Know - 'The brain requires novelty'",
    "Do you Know - 'Learning happens best through teaching others'",
    "Do you Know - 'Our brain functions on the “use it or lose it” principle'",
  ];

  const [favSubCode, setFavSubCode] = useState([]);
  const [hiddenSubjectCode, setHidnSubjectCode] = useState([]);

  const [formData, setFormData] = useState({
    user_id: "",
    hidden_subcode: "",
    fav_subcode: "",
  });

  const [response, setResponse] = useState(null);
  const [fetchFavAndHide, setFetchFavAndHide] = useState(null);

  // Fetch User Favorites
  const fetchUserFavorites = async (user_id) => {
    if (!user_id) {
      console.error("User ID is required to fetch favorites.");
      return;
    }

    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_User_Fav.php?user_id=${user_id}`
      );
      const result = await response.json();

      if (result.status === "success") {
        setFetchFavAndHide(result.data);

        const newFavArray =
          result.data?.fav_subcode?.split(",").map((item) => item.trim()) || [];
        const newHiddenArray =
          result.data?.hidden_subcode?.split(",").map((item) => item.trim()) ||
          [];

        // Update the state
        setFavSubCode(newFavArray);
        setHidnSubjectCode(newHiddenArray);

        // Sync fetched data with formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          hidden_subcode: newHiddenArray.length
            ? newHiddenArray.join(",")
            : "-",
          fav_subcode: newFavArray.length ? newFavArray.join(",") : "-",
        }));
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error.message);
    }
  };

  // Update Form Data on User Change
  useEffect(() => {
    if (user?.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: user.id,
      }));
      fetchUserFavorites(user.id);
    }
  }, [user]);

  // Toggle Hidden Subject Code
  const handleHide = (id, type) => {
    if (type === "subCode") {
      setHidnSubjectCode((prevArray) => {
        const updatedArray = prevArray.includes(id)
          ? prevArray.filter((item) => item !== id)
          : [...prevArray, id];
        return updatedArray;
      });
    }
  };

  // Toggle Favorite Subject Code
  const handleFav = (id, type) => {
    if (type === "subCode") {
      setFavSubCode((prevArray) => {
        const updatedArray = prevArray.includes(id)
          ? prevArray.filter((item) => item !== id)
          : [...prevArray, id];
        return updatedArray;
      });
    }
  };

  // Sync Form Data when Hidden or Favorite Subject Codes Change
  useEffect(() => {
    if (fetchFavAndHide) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hidden_subcode:
          hiddenSubjectCode.length === 0 ? "-" : hiddenSubjectCode.join(","),
      }));
    }
  }, [hiddenSubjectCode]);

  useEffect(() => {
    if (fetchFavAndHide) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        fav_subcode: favSubCode.length === 0 ? "-" : favSubCode.join(","),
      }));
    }
  }, [favSubCode]);

  // Submit Form Data
  const handleSubmitFavAndHide = async () => {
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );

    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/MCQTown/User_Favorites.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredFormData),
        }
      );

      const result = await response.json();
      setResponse(result.message || "An error occurred");
    } catch (error) {
      setResponse("Error: " + error.message);
    }
  };

  // Trigger Submit on Form Data Change
  useEffect(() => {
    if (user) {
      if (formData.user_id) {
        handleSubmitFavAndHide();
      }
    }
  }, [formData.hidden_subcode, formData.fav_subcode, user]);
  // /////////////////////////////////////////end of fav nad hide/////////////////////////////
  const handleTest = (obj) => {
    setDefaultActiveBtn("All");
    setSubject(obj);
    navigate("/TestSeries/Select-Topics");
  };

  const handleNotes = (obj) => {
    setNotesBtnClicked((prev) => !prev);
    setSubject(obj);
  };

  const isRecent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  const countRecentTopics = (value, notes) => {
    let recentCount = { recentCount: 0, forNotes: false, forTest: false };

    value.topics.forEach((topic) => {
      if (isRecent(topic.createdOn)) {
        recentCount.recentCount++;
        recentCount.forNotes = true;
      }
    });

    notes?.forEach((note) => {
      if (note.sub === value.sub) {
        value?.topics?.forEach((topic) => {
          if (
            Number(topic?.topcode) === Number(note?.topcode) &&
            isRecent(note.createdOn)
          ) {
            recentCount.recentCount++;
            recentCount.forNotes = true;
          }
        });
      }
    });

    return recentCount;
  };
  // Object.entries(department?.subjects).map(([key, value]) => {
  //   console.log(value.totals.filter((qdata) => qdata.unique_questions !== 0));
  // });
  // ////////////////////////////////////////////////////////////////////////////////

  const FetchData = async () => {
    setLoading(true);
    setError(null);
    // Properly encode the SearchKeyWord for URL
    const apiUrl = `https://railwaymcq.com/railwaymcq/100YoRE/Get_user_and_dep_data_2.php?depttcode=${
      department?.depttcode
    }&user_id=${user !== null ? user.id : 3}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setFetchedDepartData(result[0]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchData();
  }, [department]);
  useEffect(() => {
    // Ensure department is properly set in the state

    if (fetchedDepartData) {
      const filteredData = JSON.parse(JSON.stringify(fetchedDepartData)); // Create a deep copy

      for (const subjectKey in filteredData.subjects) {
        // Filter topics with unique_questions > 0
        filteredData.subjects[subjectKey].topics = filteredData.subjects[
          subjectKey
        ].topics.filter((topic) => topic.qbank.unique_questions > 0);

        // If no topics remain, delete the subject
        if (filteredData.subjects[subjectKey].topics.length === 0) {
          delete filteredData.subjects[subjectKey];
        }
      }

      // Update state with filtered data

      if (user?.login_type === "admin" || user?.name === "new") {
        setDisplayData(fetchedDepartData);
      } else setDisplayData(filteredData);
      // setHiddenDisplayData(displayData);
    }
  }, [fetchedDepartData]); // Depend on `department` to trigger the effect
  /////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    setCurrentTextIndex(1);
  }, [department?.deptt]);
  useEffect(() => {
    if (currentTextIndex < messages.length) {
      const timer = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      }, 3000 + currentTextIndex * 500);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [currentTextIndex]);

  //////////////////////////// hiding subject ///////////////////////
  useEffect(() => {
    if (displayData) {
      if (showHiddenSubject) {
        setHiddenDisplayData({
          ...displayData,
          subjects: Object.fromEntries(
            Object.entries(displayData.subjects).filter(([key]) =>
              hiddenSubjectCode?.includes(key)
            )
          ),
        });
      } else {
        setHiddenDisplayData({
          ...displayData,
          subjects: Object.fromEntries(
            Object.entries(displayData.subjects).filter(
              ([key]) => !hiddenSubjectCode?.includes(key)
            )
          ),
        });
      }
    }
  }, [showHiddenSubject, hiddenSubjectCode, displayData]);

  return (
    <div
      className="container mt-5"
      style={{
        fontSize: "14px",
      }}
    >
      {" "}
      {loading ? (
        <div>
          {" "}
          <BirdSprite /> <Loading />
          <div>{messages[currentTextIndex - 1]}</div>
        </div>
      ) : (
        <div>
          <SubjectCompElement selected={displayData} />

          {notesBtnClicked && (
            <div
              style={{
                margin: "0",
                position: "fixed",
                top: "0",
                left: "0",
                height: "100vh",
                width: "100vw",
                zIndex: "3",
                // filter: "blur(10px)",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setNotesBtnClicked(false)}
            >
              <div
                className="position-relative boxRadios"
                style={{
                  boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)",
                  borderRadius: "15px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="position-absolute top-0 end-0 m-2"
                  style={{
                    cursor: "pointer",
                    background: "white",
                  }}
                  onClick={() => setNotesBtnClicked(false)}
                >
                  <IoCloseCircleSharp
                    style={{
                      color: "red",
                      boxShadow: "5px 5px 10px rgba(0,0,0, 0.3)",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <NotesReader onClick={(e) => e.stopPropagation()} />
              </div>
            </div>
          )}
          {subjectList && hiddenDisplayData && (
            <div className="row mb-1">
              <div className="col-md-11">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>
                      {!showHiddenSubject ? "Subjects" : "Hidden Subject"}
                    </h5>
                  </div>
                  <div>
                    {hiddenDisplayData?.subjects
                      ? Object.keys(hiddenDisplayData.subjects).length
                      : "0"}{" "}
                    subjects Found
                  </div>
                </div>
              </div>

              <div className="col-md-1">
                <div>
                  {!showHiddenSubject ? (
                    <MdVisibility
                      style={{ color: "#118fff", cursor: "pointer" }}
                      onClick={() => setShowHiddenSubject(!showHiddenSubject)}
                    />
                  ) : (
                    <AiFillEyeInvisible
                      style={{ color: "gray", cursor: "pointer" }}
                      onClick={() => setShowHiddenSubject(!showHiddenSubject)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="row">
            {subjectList &&
              displayData &&
              hiddenDisplayData &&
              hiddenDisplayData.subjects &&
              Object.entries(hiddenDisplayData.subjects)
                .sort(([keyA], [keyB]) => {
                  const isFavA = favSubCode.includes(keyA);
                  const isFavB = favSubCode.includes(keyB);

                  // Place marked topics (true) before unmarked (false)
                  if (isFavA && !isFavB) return -1; // A comes before B
                  if (!isFavA && isFavB) return 1; // B comes before A
                  return 0; // Maintain relative order for same category
                })
                .map(([key, value]) => {
                  // console.log(value);
                  const recentCount = countRecentTopics(value, notes);

                  const totalAttQuestion =
                    (value?.user_record?.total_attempted /
                      value?.totals?.unique_questions) *
                    100;
                  const totalCorQuestion =
                    (value?.user_record?.total_correct /
                      value?.user_record?.total_attempted) *
                    100;
                  const totalWroQuestion =
                    ((value?.user_record?.total_attempted -
                      value?.user_record?.total_correct) /
                      value?.user_record?.total_attempted) *
                    100;
                  const bgValue =
                    (value?.totals?.total_verified /
                      value?.totals?.unique_questions) *
                    100;
                  return (
                    <div
                      key={key}
                      className="col-md-4 mb-3 parent"
                      // style={{ background: "red" }}
                    >
                      <div
                        className="card Subject underline position-relative"
                        style={{
                          border: `2px solid #${
                            bgValue < 33
                              ? "fba296"
                              : bgValue < 66
                              ? "96c2fb"
                              : bgValue < 90
                              ? "96fbb9"
                              : "55da75"
                          }`,
                        }}
                      >
                        <div
                          className=" Subject position-absolute top-50 start-100 translate-middle me-1 ms-1 "
                          style={{ background: "#d9d9d9", borderRadius: "4px" }}
                        >
                          <span
                            className={` rounded-pill `}
                            style={{
                              color: !hiddenSubjectCode.includes(key)
                                ? "#118fff"
                                : "gray",
                              cursor: "pointer",
                            }}
                            onClick={() => handleHide(key, "subCode")}
                          >
                            {!hiddenSubjectCode.includes(key) ? (
                              <MdVisibility />
                            ) : (
                              <AiFillEyeInvisible />
                            )}
                          </span>
                          <span
                            className={` rounded-pill `}
                            style={{
                              color: favSubCode.includes(key) ? "red" : "gray",
                              cursor: "pointer",
                            }}
                            onClick={() => handleFav(key, "subCode")}
                          >
                            {favSubCode.includes(key) ? (
                              <IoHeart />
                            ) : (
                              <IoHeartDislike />
                            )}
                          </span>
                          <span
                            className={` rounded-pill `}
                            style={{
                              width: "10px",
                            }}
                          ></span>
                        </div>
                        {recentCount?.recentCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {recentCount?.recentCount}
                          </span>
                        )}
                        <div className="card-body position-relative mt-2 mr-2 me-2">
                          <p
                            className="position-absolute top-0 start-0"
                            style={{ fontSize: "12px" }}
                          >
                            {department.deptt}
                          </p>{" "}
                          <p
                            className="position-absolute top-0 end-0"
                            style={{ fontSize: "12px" }}
                          >
                            {value?.totals?.unique_questions} Que.
                          </p>
                          <div className="position-absolute top-50 end-0 d-flex arrow justify-content-center align-items-center text-center">
                            <IoMdArrowDropright />
                          </div>
                          <div className="row">
                            <div className="col-12 col-sm-12">
                              <div className="container text-center">
                                <div className="row pb-1">
                                  <p
                                    className="col m-1"
                                    style={{ fontSize: "12px" }}
                                  >
                                    <FaBook /> {value.sub}
                                  </p>
                                </div>
                              </div>
                              <div className="container text-center">
                                <div className="row">
                                  <button
                                    className="col btn btn-outline-success m-1 position-relative"
                                    onClick={() =>
                                      handleNotes({
                                        department: department.deptt,
                                        departmentCode: department.depttcode,
                                        subject: value.sub,
                                        topics: value.topics,
                                        subjectCode: key,
                                      })
                                    }
                                  >
                                    <FaBook /> Notes{" "}
                                    {recentCount.forNotes && (
                                      <span
                                        style={{
                                          padding: "5px",
                                          color: "white",
                                          fontSize: "8px",
                                          padding: "2px",
                                        }}
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      >
                                        New
                                      </span>
                                    )}
                                  </button>
                                  <div
                                    className="col btn btn-outline-danger m-1"
                                    onClick={() =>
                                      handleTest({
                                        department: department.deptt,
                                        departmentCode: department.depttcode,
                                        subject: value.sub,
                                        topics: value.topics,
                                        subjectCode: key,
                                      })
                                    }
                                  >
                                    <PiExamFill /> Test
                                  </div>
                                </div>
                              </div>
                              {user?.login_type === "admin" ? (
                                <div
                                  className="row mt-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <div className="d-flex  justify-content-around">
                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={
                                        <Tooltip id="tooltip-dashboard">
                                          {value?.totals?.total_references} Que.
                                          have References
                                        </Tooltip>
                                      }
                                    >
                                      <div
                                        className="d-flex"
                                        style={{ fontSize: "15px" }}
                                      >
                                        {value?.totals?.total_references}{" "}
                                        <FaCopy />
                                      </div>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={
                                        <Tooltip id="tooltip-dashboard">
                                          {value?.totals?.total_verified}{" "}
                                          Verified Que.
                                        </Tooltip>
                                      }
                                    >
                                      <div
                                        className="d-flex"
                                        style={{ fontSize: "15px" }}
                                      >
                                        {value?.totals?.total_verified}{" "}
                                        <MdDomainVerification />
                                      </div>
                                    </OverlayTrigger>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            {/* ///////////////////////////////////////////////////////// */}
                            <div>
                              {" "}
                              <div style={{ fontSize: "12px" }}>
                                Your Test Record
                              </div>
                              <div className="d-flex justify-content-evenly ">
                                <div className="">
                                  {/* Attempted-//////////////////////////////// */}
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        You Attempted{" "}
                                        {value?.user_record?.total_attempted}{" "}
                                        Question, out of{" "}
                                        {value?.totals?.unique_questions}{" "}
                                        Questions .
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="d-flex align-item-center"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <CircularProgressBar
                                        data={totalAttQuestion}
                                        size="35px"
                                        primary="#0378cf"
                                        secondary="#e1f0ff"
                                      />
                                    </div>
                                  </OverlayTrigger>
                                  <div style={{ fontSize: "11px" }}>
                                    {value?.user_record?.total_attempted}
                                  </div>
                                </div>
                                <div className="">
                                  {/* correct - ///////////////////////////////////////////////// */}
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        You marked{" "}
                                        {value?.user_record?.total_correct}{" "}
                                        Correct out of{" "}
                                        {value?.user_record?.total_attempted}{" "}
                                        Attempted Questions
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="d-flex align-item-center"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <CircularProgressBar
                                        data={totalCorQuestion}
                                        size="35px"
                                        primary="#0fcf03"
                                        secondary="#e8ffe1"
                                      />
                                    </div>
                                  </OverlayTrigger>
                                  <div style={{ fontSize: "11px" }}>
                                    {value?.user_record?.total_correct}
                                  </div>
                                </div>
                                <div className="">
                                  {/* Incorrect - //////////////////////////// */}
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="tooltip-dashboard">
                                        You marked{" "}
                                        {value?.user_record?.total_attempted -
                                          value?.user_record
                                            ?.total_correct}{" "}
                                        Wrong out of{" "}
                                        {value?.user_record?.total_attempted}{" "}
                                        Attempted Questions
                                      </Tooltip>
                                    }
                                  >
                                    <div
                                      className="d-flex align-item-center"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <CircularProgressBar
                                        data={totalWroQuestion}
                                        size={"35px"}
                                        primary="#ff6347"
                                        secondary="#ffe4e1"
                                      />
                                    </div>
                                  </OverlayTrigger>
                                  <div style={{ fontSize: "11px" }}>
                                    {value?.user_record?.total_attempted -
                                      value?.user_record?.total_correct}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* ///////////////////////////////////////////////////////////// */}
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
