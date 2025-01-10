import React, { useState } from "react";
import { useEffect } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBackCircleOutline,
  IoHeart,
  IoHeartDislike,
} from "react-icons/io5";
import { FaBook, FaCopy } from "react-icons/fa";
import { PiExamFill } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { useUserContext } from "../Context/UserContext";
import { MdDomainVerification, MdVisibility } from "react-icons/md";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiQuestionnaireFill } from "react-icons/ri";
import CircularProgressBar from "../components/CircularProgressBar";
import { AiFillEyeInvisible } from "react-icons/ai";

const SelectTopics = () => {
  const { subject, setSubject, setActivePage, SearchKeyWord } =
    useGlobalContext();
  const { user } = useUserContext();
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [totalVariQuestion, setTotalVariQuestion] = useState(0);
  const [totalReferQuestion, setTotalReferQuestion] = useState(0);
  const [totalAttQuestion, setTotalAttQuestion] = useState(0);
  const [totalCorQuestion, setTotalCorQuestion] = useState(0);
  const [totalWroQuestion, setTotalWroQuestion] = useState(0);
  const [totalAttQueNo, setTotalAttQueNo] = useState(0);
  const [totalCorQueNo, setTotalCorQueNo] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [favTopCode, setFavTopCode] = useState([]);
  const [hiddenTopCode, setHideTopCode] = useState([]);
  const [fetchFavAndHide, setFetchFavAndHide] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    fav_topcode: "",
    hidden_topcode: "",
  });

  const [response, setResponse] = useState(null);

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
          result.data?.fav_topcode?.split(",").map((item) => item.trim()) || [];
        const newHiddenArray =
          result.data?.hidden_topcode?.split(",").map((item) => item.trim()) ||
          [];

        // Update the state
        setFavTopCode(newFavArray);
        setHideTopCode(newHiddenArray);

        // Sync fetched data with formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          fav_topcode: newFavArray.length ? newFavArray.join(",") : "-",
          hidden_topcode: newHiddenArray.length
            ? newHiddenArray.join(",")
            : "-",
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

  // Toggle Hidden Top Code
  const handleHide = (id, type) => {
    if (type === "topCode") {
      setHideTopCode((prevArray) => {
        const updatedArray = prevArray.includes(id)
          ? prevArray.filter((item) => item !== id)
          : [...prevArray, id];
        return updatedArray;
      });
    }
  };

  // Toggle Favorite Top Code
  const handleFav = (id, type) => {
    if (type === "topCode") {
      setFavTopCode((prevArray) => {
        const updatedArray = prevArray.includes(id)
          ? prevArray.filter((item) => item !== id)
          : [...prevArray, id];
        return updatedArray;
      });
    }
  };

  // Sync Form Data when Hidden or Favorite Top Codes Change
  useEffect(() => {
    if (fetchFavAndHide) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hidden_topcode:
          hiddenTopCode.length === 0 ? "-" : hiddenTopCode.join(","),
      }));
    }
  }, [hiddenTopCode]);

  useEffect(() => {
    if (fetchFavAndHide) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        fav_topcode: favTopCode.length === 0 ? "-" : favTopCode.join(","),
      }));
    }
  }, [favTopCode]);

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
  }, [formData.hidden_topcode, formData.fav_topcode, user]);
  // //////////////////////////////////end of fav and hide///////////////////////////////////
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setActivePage("Admin");
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  const handleGoBack = () => {
    if (SearchKeyWord) {
      navigate("/Home/Search-Result");
    } else {
      navigate("/TestSeries");
    }
  };
  const handleTest = (topic, topicCode) => {
    setSubject({
      ...subject,
      selectedTopic: topic,
      selectedTopicCode: topicCode,
    });
    // setSelectedInfo({ subject: subject.subject });
    navigate("/TestSeries/Select-Test");
  };
  const isRecent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };
  useEffect(() => {
    if (subject) {
      let q = 0;
      let r = 0;
      let v = 0;
      let c = 0;
      let a = 0;
      Object.entries(subject?.topics).map(([key, value]) => {
        Object.entries(value.qbank).forEach(([data, dataValue]) => {
          if (data === "unique_questions") {
            q += Number(dataValue);
          }
          if (data === "total_references") {
            r += Number(dataValue);
          }
          if (data === "total_verified") {
            v += Number(dataValue);
          }
        });
      });
      Object.entries(subject?.topics).forEach(([key, value]) => {
        Object.entries(value.user_record).forEach(([data, dataValue]) => {
          if (data === "attempted_questions") {
            a += Number(dataValue);
          }
          if (data === "correct_questions") {
            c += Number(dataValue);
          }
        });
      });
      setTotalQuestion(q);
      setTotalReferQuestion(r);
      setTotalVariQuestion(v);
      setTotalAttQueNo(a);
      setTotalCorQueNo(c);
      setTotalCorQuestion((c / a) * 100);
      setTotalAttQuestion((a / q) * 100);
      setTotalWroQuestion(((a - c) / a) * 100);
    }
  }, [subject]);
  const countRecentTopics = (topic) => {
    let recentCount = 0;

    if (isRecent(topic.createdOn)) {
      recentCount++;
    }

    return recentCount;
  };

  return (
    <div className="container text-start mt-12" style={{ minHeight: "90vh" }}>
      {" "}
      <div class="d-flex flex-row  align-items-center mb-3">
        <div class="p-2">
          <IoArrowBackCircleOutline
            className="backBtn "
            style={{
              borderRadius: "100%",
              border: "0px",
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={handleGoBack}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "black";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = ""; // Reset to default
              e.target.style.color = ""; // Reset to default
            }}
          />
        </div>
        <div class="p-2">
          <h3>Select Topic for {subject.subject}</h3>
        </div>
      </div>
      <hr />
      <div className="papaDiv mt-2">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-around">
            <div>
              {" "}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-dashboard">
                    {totalQuestion} Total Que.
                  </Tooltip>
                }
              >
                <div
                  className="d-flex align-item-center"
                  style={{ fontSize: "15px" }}
                >
                  {totalQuestion} <RiQuestionnaireFill />
                  &nbsp;&nbsp;
                </div>
              </OverlayTrigger>
            </div>{" "}
            {user.login_type === "admin" ? (
              <div>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      {totalVariQuestion} Total Verified Questions.
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    {totalVariQuestion} <MdDomainVerification />
                    &nbsp;&nbsp;
                  </div>
                </OverlayTrigger>{" "}
              </div>
            ) : null}
            {user.login_type === "admin" ? (
              <div>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      {totalReferQuestion} Questions have References.
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    {totalReferQuestion} <FaCopy />
                  </div>
                </OverlayTrigger>
              </div>
            ) : null}
          </div>
          <div className="text-center">
            {" "}
            Your Test Record
            <div className="d-flex justify-content-evenly ">
              <div className="m-2">
                {/* Attempted-//////////////////////////////// */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      You marked {totalAttQueNo} Correct out of {totalQuestion}{" "}
                      Attempted Questions
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    <CircularProgressBar
                      data={totalAttQuestion}
                      size="50px"
                      primary="#0378cf"
                      secondary="#e1f0ff"
                    />
                  </div>
                </OverlayTrigger>
                <div style={{ fontSize: "11px" }}>{totalAttQueNo}</div>
              </div>
              <div className="m-2">
                {/* correct - ///////////////////////////////////////////////// */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      You marked {totalCorQueNo} Correct out of {totalAttQueNo}{" "}
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
                      size="50px"
                      primary="#0fcf03"
                      secondary="#e8ffe1"
                    />
                  </div>
                </OverlayTrigger>
                <div style={{ fontSize: "11px" }}>{totalCorQueNo}</div>
              </div>
              <div className="m-2">
                {/* Incorrect - //////////////////////////// */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      You marked {totalAttQueNo - totalCorQueNo} Wrong out of{" "}
                      {totalAttQueNo} Attempted Questions
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    <CircularProgressBar
                      data={totalWroQuestion}
                      // size={"50px"}
                      primary="#ff6347"
                      secondary="#ffe4e1"
                    />
                  </div>
                </OverlayTrigger>
                <div style={{ fontSize: "11px" }}>
                  {totalAttQueNo - totalCorQueNo}
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex flex-column mb-3"
            style={{ position: "relative" }}
          >
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={toggleDropdown}
              style={{ width: "fit-content" }}
            >
              Color Code
            </button>

            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0",
                  zIndex: "10",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                  borderRadius: "4px",
                  width: "200px", // Adjust width as needed
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <div
                    style={{
                      borderRadius: "2px",
                      height: "12px",
                      width: "18px",
                      border: "1px solid red",
                      marginRight: "8px",
                    }}
                  ></div>
                  <div>&lt; 33% Verified Q</div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div
                    style={{
                      borderRadius: "2px",
                      height: "12px",
                      width: "18px",
                      border: "1px solid blue",
                      marginRight: "8px",
                    }}
                  ></div>
                  <div>&lt; 66% Verified Q</div>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      borderRadius: "2px",
                      height: "12px",
                      width: "18px",
                      border: "1px solid green",
                      marginRight: "8px",
                    }}
                  ></div>
                  <div>&gt; 66% Verified Q</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* //////////////////////////////////////////////////////////////// */}
      <div className="row">
        {subject &&
          Object.entries(subject?.topics)
            .sort(([keyA, valueA], [keyB, valueB]) => {
              const isFavA = favTopCode.includes(valueA.topcode);
              const isFavB = favTopCode.includes(valueB.topcode);

              // Place marked topics (true) before unmarked (false)
              if (isFavA && !isFavB) return -1; // A comes before B
              if (!isFavA && isFavB) return 1; // B comes before A
              return 0; // Maintain relative order for same category
            })
            .map(([key, value]) => {
              const recentCount = countRecentTopics(value);
              const totalAttQuestionTopic =
                (value?.user_record?.attempted_questions /
                  value?.qbank?.unique_questions) *
                100;
              const totalCorQuestionTopic =
                (value?.user_record?.correct_questions /
                  value?.user_record?.attempted_questions) *
                100;
              const totalWroQuestionTopic =
                ((value?.user_record?.attempted_questions -
                  value?.user_record?.correct_questions) /
                  value?.user_record?.attempted_questions) *
                100;
              const bgValue =
                (value?.qbank.total_verified / value?.qbank.unique_questions) *
                100;

              return (
                <div key={key} className="col-md-4 mb-3 parent " style={{}}>
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
                      className="Subject position-absolute top-50 start-100 translate-middle me-1 ms-1 "
                      style={{ background: "#d9d9d9", borderRadius: "4px" }}
                    >
                      <span
                        className={` rounded-pill `}
                        style={{
                          color: !hiddenTopCode.includes(value.topcode)
                            ? "#118fff"
                            : "gray",
                          cursor: "pointer",
                        }}
                        onClick={() => handleHide(value.topcode, "topCode")}
                      >
                        {!hiddenTopCode.includes(value.topcode) ? (
                          <MdVisibility />
                        ) : (
                          <AiFillEyeInvisible />
                        )}
                      </span>
                      <span
                        className={` rounded-pill `}
                        style={{
                          color: favTopCode.includes(value.topcode)
                            ? "red"
                            : "gray",
                          cursor: "pointer",
                        }}
                        onClick={() => handleFav(value.topcode, "topCode")}
                      >
                        {favTopCode.includes(value.topcode) ? (
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
                    {recentCount > 0 && (
                      <span className="position-absolute  top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        New
                      </span>
                    )}
                    <div className="card-body  position-relative m-2">
                      <p
                        className="position-absolute top-0 start-0 "
                        style={{ fontSize: "12px" }}
                      >
                        {subject.department}
                      </p>
                      <p
                        className="position-absolute top-0 end-0"
                        style={{ fontSize: "12px" }}
                      >
                        {value?.qbank.unique_questions} Que.
                      </p>
                      <div className="position-absolute top-50 end-0 d-flex arrow justify-content-center align-items-center text-center">
                        <IoMdArrowDropright />
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-12">
                          <div className="container text-center">
                            <div className="row  pb-1">
                              <p
                                className="col m-1"
                                style={{ fontSize: "12px" }}
                              >
                                <FaBook /> {value.topic}
                              </p>
                            </div>
                          </div>
                          <div className="container text-center">
                            <div className="row">
                              {/* <button
                            className="col btn btn-outline-success m-1"
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
                            <FaBook /> Notes
                          </button> */}
                              <div
                                className="col btn btn-outline-danger m-1"
                                onClick={() =>
                                  handleTest(value.topic, value.topcode)
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
                                      {value?.qbank.total_references} Que. have
                                      References
                                    </Tooltip>
                                  }
                                >
                                  <div
                                    className="d-flex"
                                    style={{ fontSize: "15px" }}
                                  >
                                    {value?.qbank.total_references} <FaCopy />
                                  </div>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-dashboard">
                                      {value?.qbank.total_verified} Verified
                                      Que.
                                    </Tooltip>
                                  }
                                >
                                  <div
                                    className="d-flex"
                                    style={{ fontSize: "15px" }}
                                  >
                                    {value?.qbank.total_verified}{" "}
                                    <MdDomainVerification />
                                  </div>
                                </OverlayTrigger>
                                {/* <div>
                              {value?.qbank.total_references}  Que. have References 
                              </div>
                              <div>
                                Verified Que. {value?.qbank.total_verified}{" "}
                              </div> */}
                              </div>
                            </div>
                          ) : null}
                        </div>
                        {/* ///////////////////////////////////////////////////////// */}
                        <div className="text-center">
                          <div style={{ fontSize: "11px" }}>
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
                                    {value?.user_record?.attempted_questions}{" "}
                                    Question, out of{" "}
                                    {value?.qbank.unique_questions} Questions .
                                  </Tooltip>
                                }
                              >
                                <div
                                  className="d-flex align-item-center"
                                  style={{ fontSize: "15px" }}
                                >
                                  <CircularProgressBar
                                    data={totalAttQuestionTopic}
                                    size="35px"
                                    primary="#0378cf"
                                    secondary="#e1f0ff"
                                  />
                                </div>
                              </OverlayTrigger>
                              <div style={{ fontSize: "11px" }}>
                                {value?.user_record?.attempted_questions}
                              </div>
                            </div>
                            <div className="">
                              {/* correct - ///////////////////////////////////////////////// */}
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="tooltip-dashboard">
                                    You marked{" "}
                                    {value?.user_record?.correct_questions}{" "}
                                    Correct out of{" "}
                                    {value?.user_record?.attempted_questions}{" "}
                                    Attempted Questions
                                  </Tooltip>
                                }
                              >
                                <div
                                  className="d-flex align-item-center"
                                  style={{ fontSize: "15px" }}
                                >
                                  <CircularProgressBar
                                    data={totalCorQuestionTopic}
                                    size="35px"
                                    primary="#0fcf03"
                                    secondary="#e8ffe1"
                                  />
                                </div>
                              </OverlayTrigger>
                              <div style={{ fontSize: "11px" }}>
                                {value?.user_record?.correct_questions}
                              </div>
                            </div>
                            <div className="">
                              {/* Incorrect - //////////////////////////// */}
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip id="tooltip-dashboard">
                                    You marked{" "}
                                    {value?.user_record?.attempted_questions -
                                      value?.user_record
                                        ?.correct_questions}{" "}
                                    Wrong out of{" "}
                                    {value?.user_record?.attempted_questions}{" "}
                                    Attempted Questions
                                  </Tooltip>
                                }
                              >
                                <div
                                  className="d-flex align-item-center"
                                  style={{ fontSize: "15px" }}
                                >
                                  <CircularProgressBar
                                    data={totalWroQuestionTopic}
                                    size={"35px"}
                                    primary="#ff6347"
                                    secondary="#ffe4e1"
                                  />
                                </div>
                              </OverlayTrigger>
                              <div style={{ fontSize: "11px" }}>
                                {value?.user_record?.attempted_questions -
                                  value?.user_record?.correct_questions}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* ///////////////////////////////////////////////////////////// */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {/* //////////////////////////////////////////////////////////////// */}
    </div>
  );
};
export default SelectTopics;
