import React, { useState, useEffect, useRef } from "react";
import "./css/slid.css";
import Subjects from "./Subjects";
import { useGlobalContext } from "../Context/GlobalContextOne";
import {
  MdDomainVerification,
  MdLeaderboard,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdVisibility,
} from "react-icons/md";
import { useUserContext } from "../Context/UserContext";
import Loading from "./Loading";
import "./css/NoteReader.css"; // Import the custom CSS
import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { FaHeart, FaRegEdit } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { AiFillEyeInvisible } from "react-icons/ai";
import { IoHeart, IoHeartDislike } from "react-icons/io5";
import SelectTest from "../pages/SelectTest";

const DepartmentCarousel = ({ departments, from }) => {
  const { user } = useUserContext();
  const [customizeBtnClicked, setCustomizeBtnClicked] = useState(false);
  const [hiddenDepttCode, setHideDepttCode] = useState([]);
  const [favDepttCode, setFavDepttCode] = useState([]);

  const [fetchUserFavoritesData, setFetchUserFavoritesData] = useState(null);
  const [departmentToBeDisplay, setDepartmentToBeDisplay] = useState();
  const [totalCorQueNo, setTotalCorQuesNo] = useState(0);
  const [totalAttQueNo, setTotalAttQueNo] = useState(0);
  const [totalWroQuestion, setTotalWroQuestion] = useState(0);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [fetchFavAndHide, setFetchFavAndHide] = useState(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const {
    department_loading,
    department_error,
    notes,
    subject,
    setSelectedInfo,
    activePage,
    setSubject,
    selected,
  } = useGlobalContext();

  //  setting of setSelect  department: department.deptt,
  // departmentCode: department.depttcode,
  // subject: value.sub,
  // topics: value.topics,
  // subjectCode: key,
  // selectedTopic: topic,
  // selectedTopicCode: topicCode,
  useEffect(() => {
    if (selected) {
      let topicSel =
        selected?.subjects[Object.keys(selected?.subjects)[0]].topics;
      setSubject({
        ...subject,
        department: selected?.deptt,
        departmentCode: selected?.depttcode,
        subject: selected?.subjects[Object.keys(selected?.subjects)[0]].sub,
        topics: selected?.subjects[Object.keys(selected?.subjects)[0]].topics,
        subjectCode: Object.keys(selected?.subjects)[0],
        selectedTopic: topicSel[0]?.topic,
        selectedTopicCode: topicSel[0]?.topcode,
      });
    }
  }, [selected?.depttcode]);

  const sliderRef = useRef(null);
  const activeButtonRef = useRef(null); // Ref for the active button
  // useEffect(() => {
  //   if (selected) {
  //     setSelectedInfo(selected);
  //   }
  // }, [selected]);

  useEffect(() => {
    if (from === "HOME") {
      return;
    }
    setDepartmentToBeDisplay(departments);
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    setFormData({
      user_id: "",
      hidden_depttcode: "",
      fav_department: "",
    });
    if (user) {
      fetchUserFavorites(user.id);
    } else setFetchUserFavoritesData(null);
  }, [user]);
  // useEffect(() => {
  //   setHideDepttCode(fetchUserFavoritesData?.hidden_depttcode);
  //   setFavDepttCode(fetchUserFavoritesData?.fav_department);
  // }, [fetchUserFavoritesData]);
  // Scroll the active button into view
  useEffect(() => {
    setFavDepttCode(["-"]);
    setHideDepttCode(["-"]);
  }, [user]);
  useEffect(() => {
    if (activeButtonRef.current && sliderRef.current) {
      const activeButton = activeButtonRef.current;
      const slider = sliderRef.current;

      // Calculate the left offset of the active button relative to the slider container
      const offsetLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = slider.clientWidth;

      // Scroll the slider container horizontally to the active button
      const scrollPosition = offsetLeft - containerWidth / 2 + buttonWidth / 2;
      slider.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [selected, activePage]);

  const handleClick = (department) => {
    setSelectedInfo(department);
  };

  const isRecent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  const countRecentTopics = (department, notes) => {
    let recentCount = 0;
    // Count recent topics
    Object.values(department.subjects).forEach((subject) => {
      subject.topics.forEach((topic) => {
        if (isRecent(topic.createdOn)) {
          recentCount++;
        }
      });
    });

    // Count recent notes that match subCode and topcode
    notes?.forEach((note) => {
      const subject = department.subjects[note.subCode];
      if (subject) {
        subject.topics.forEach((topic) => {
          if (
            Number(note.topcode) === Number(topic.topcode) &&
            isRecent(note.createdOn)
          ) {
            recentCount++;
          }
        });
      }
    });

    return recentCount;
  };

  const smoothScroll = (element, direction) => {
    const start = element.scrollLeft;
    const distance = direction === "left" ? -100 : 100;
    const duration = 300; // in ms
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      element.scrollLeft = start + distance * progress;
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      smoothScroll(sliderRef.current, "left");
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      smoothScroll(sliderRef.current, "right");
    }
  };

  //  //////////////////////////////////////////////////updating the back end for user Fav ?????????????????
  const [formData, setFormData] = useState({
    user_id: "",
    hidden_depttcode: "",
    fav_department: "",
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

        // Update state with fetched data
        const newFavArray =
          result.data?.fav_department?.split(",").map((item) => item.trim()) ||
          [];
        const newHiddenArray =
          result.data?.hidden_depttcode
            ?.split(",")
            .map((item) => item.trim()) || [];

        setFavDepttCode(newFavArray);
        setHideDepttCode(newHiddenArray);

        // Ensure formData syncs with the fetched data
        setFormData((prevFormData) => ({
          ...prevFormData,
          hidden_depttcode: newHiddenArray.length
            ? newHiddenArray.join(",")
            : "-",
          fav_department: newFavArray.length ? newFavArray.join(",") : "-",
        }));
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error.message);
    }
  };

  // Update Form Data when User Changes
  useEffect(() => {
    if (user?.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: user.id,
      }));
      fetchUserFavorites(user.id);
    }
  }, [user]);

  // Toggle Hidden Department
  const handleHide = (id) => {
    setHideDepttCode((prevArray) => {
      const updatedArray = prevArray.includes(id)
        ? prevArray.filter((item) => item !== id)
        : [...prevArray, id];
      return updatedArray;
    });
  };

  // Toggle Favorite Department
  const handleFav = (id) => {
    setFavDepttCode((prevArray) => {
      const updatedArray = prevArray.includes(id)
        ? prevArray.filter((item) => item !== id)
        : [...prevArray, id];
      return updatedArray;
    });
  };

  // Sync Form Data when Hidden or Favorite Departments Change
  useEffect(() => {
    if (fetchFavAndHide) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hidden_depttcode:
          hiddenDepttCode.length === 0 ? "-" : hiddenDepttCode.join(","),
      }));
    }
  }, [hiddenDepttCode]);

  useEffect(() => {
    if (fetchFavAndHide) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        fav_department:
          favDepttCode.length === 0 ? "-" : favDepttCode.join(","),
      }));
    }
  }, [favDepttCode]);

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
    if (fetchFavAndHide?.user_id && fetchFavAndHide?.user_id === user?.id) {
      if (formData.user_id) {
        handleSubmitFavAndHide();
      }
    }
  }, [formData.hidden_depttcode, formData.fav_department]);

  // /////////////////////////////SHOing and Hiding///////////////////
  useEffect(() => {
    if (customizeBtnClicked) {
      setDepartmentToBeDisplay(departments);
    } else {
      setDepartmentToBeDisplay(
        departments?.filter(
          (departObj) => !hiddenDepttCode?.includes(departObj?.depttcode)
        )
      );
    }
  }, [customizeBtnClicked, hiddenDepttCode, departments]);
  return (
    <div className="container" style={{ margin: "0px", padding: "0px" }}>
      <div
        className="row"
        style={{
          borderRadius: "10px",
          boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="text-start">
            <h5>
              <MdLeaderboard />{" "}
              {from === "HOME" ? "On Going Tests" : "Departments"}{" "}
              {department_loading ? (
                <Loading style={{ width: "15px" }} />
              ) : null}
            </h5>
            <p style={{ margin: "0px", padding: "0px" }}>
              An investment in knowledge pays the best interest.
            </p>
          </div>
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-dashboard">customize</Tooltip>}
            >
              <div
                className="d-flex Subject"
                style={{
                  fontSize: "15px",
                  color: customizeBtnClicked ? "red" : "black",
                }}
                onClick={() => {
                  setCustomizeBtnClicked(!customizeBtnClicked);
                }}
              >
                <FaRegEdit />
              </div>
            </OverlayTrigger>{" "}
          </div>
        </div>

        <div className="col-md-12">
          <div
            className="d-flex justify-content-center   m-3"
            style={{ position: "relative" }}
          >
            <button
              className=" btn btn-outline-dark Subject "
              onClick={slideLeft}
            >
              <GrFormPreviousLink
                className=""
                style={{
                  fontSize: "",
                }}
              />
            </button>
            <div
              className="scrollspy-example-2"
              ref={sliderRef}
              style={{
                overflowX: "auto ",
                whiteSpace: "nowrap",
              }}
            >
              {departmentToBeDisplay
                ?.sort((valueA, valueB) => {
                  const isFavA = favDepttCode?.includes(valueA.depttcode);
                  const isFavB = favDepttCode?.includes(valueB.depttcode);

                  // Place marked topics (true) before unmarked (false)
                  if (isFavA && !isFavB) return -1; // A comes before B
                  if (!isFavA && isFavB) return 1; // B comes before A
                  return 0; // Maintain relative order for same category
                })
                .map((department, index) => {
                  const recentCount = countRecentTopics(department, notes);
                  return (
                    <div
                      className="mt-3 m-2 Subject"
                      key={index}
                      style={{ display: "inline-block", borderRadius: "5px" }}
                    >
                      <button
                        className={`btn btn-outline-dark position-relative ${
                          selected?.deptt === department.deptt ? "active" : ""
                        }`}
                        onClick={() => handleClick(department)}
                        ref={
                          selected?.deptt === department.deptt
                            ? activeButtonRef
                            : null
                        } // Attach the ref to the active button
                      >
                        {department.deptt}

                        {customizeBtnClicked ? (
                          <div
                            className="position-absolute top-0 start-100 translate-middle me-1 ms-1 "
                            style={{
                              background: "#d9d9d9",
                              borderRadius: "4px",
                            }}
                          >
                            <span
                              className={` rounded-pill `}
                              style={{
                                color: !hiddenDepttCode.includes(
                                  department.depttcode
                                )
                                  ? "#118fff"
                                  : "gray",
                              }}
                              onClick={() =>
                                handleHide(department.depttcode, "DepttCode")
                              }
                            >
                              {!hiddenDepttCode.includes(
                                department.depttcode
                              ) ? (
                                <MdVisibility />
                              ) : (
                                <AiFillEyeInvisible />
                              )}
                            </span>
                            <span
                              className={` rounded-pill `}
                              style={{
                                color: favDepttCode.includes(
                                  department.depttcode
                                )
                                  ? "red"
                                  : "gray",
                              }}
                              onClick={() =>
                                handleFav(department.depttcode, "DepttCode")
                              }
                            >
                              {favDepttCode.includes(department.depttcode) ? (
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
                        ) : (
                          recentCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {recentCount}
                            </span>
                          )
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              className="btn btn-outline-dark Subject"
              onClick={slideRight}
              style={{}}
            >
              <GrFormNextLink style={{}} />
            </button>
          </div>
        </div>
      </div>
      {selected?.deptt ? <SelectTest from={from} /> : null}
    </div>
  );
};

export default DepartmentCarousel;
