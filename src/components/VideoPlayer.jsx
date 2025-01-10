import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { useGlobalContext } from "../Context/GlobalContextOne";
import GoBackCom from "./GoBackCom";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

import { BiDislike, BiLike, BiSolidLike, BiSolidDislike } from "react-icons/bi";

const VideoPlayer = () => {
  const { videoData, setVideoData, allVideos } = useGlobalContext();
  const [liked, setLiked] = useState(false);
  const [disLiked, setDisLiked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsedCom, setIsCollapsedCom] = useState(false);

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleCollapseCom = () => {
    handleshowComment(videoData?.id);
    setIsCollapsedCom(!isCollapsedCom);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes] = await Promise.all([
          fetch(
            "https://railwaymcq.com/railwaymcq/100YoRE/videolinks_api.php"
          ).then((res) => res.json()),
        ]);
        setVideoData({ allVideos: videoRes });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [videoData]);

  const updateViews = async (videoId) => {
    try {
      const updateviewsflag = "1";
      const response = await fetch(
        "https://railwaymcq.com/student/updatevideoviews.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, updateviewsflag }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Failed to update views", error);
    }
  };

  useEffect(() => {
    if (videoData?.id) {
      updateViews(videoData?.id);
    }
  }, [videoData]);

  const filterDataByKeywords = (array, entry) => {
    const keywords = entry?.toLowerCase()?.split(" ").slice(0, 5);
    const suggestionsSet = new Set();

    keywords?.forEach((keyword) => {
      array?.forEach((item) => {
        if (videoData?.link !== item.link) {
          if (item.title.toLowerCase().includes(keyword)) {
            suggestionsSet.add(item);
          }
        }
      });
    });

    return Array.from(suggestionsSet);
  };

  const handleLikeDisLike = async (action) => {
    if (action === "like") {
      if (!liked) {
        if (disLiked) {
          await updateDisLikes(videoData?.id, true);
          setDisLiked(false);
        }
        await updateLikes(videoData?.id);
        setLiked(true);
      } else {
        await updateLikes(videoData?.id, true);
        setLiked(false);
      }
    }
    if (action === "dislike") {
      if (!disLiked) {
        if (liked) {
          await updateLikes(videoData?.id, true);
          setLiked(false);
        }
        await updateDisLikes(videoData?.id);
        setDisLiked(true);
      } else {
        await updateDisLikes(videoData?.id, true);
        setDisLiked(false);
      }
    }
  };

  const updateDisLikes = async (videoId, isUndo = false) => {
    try {
      const updatedislikeflag = isUndo ? "-1" : "1";
      const response = await fetch(
        "https://railwaymcq.com/student/updatevideoviews.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, updatedislikeflag }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Failed to update dislikes", error);
    }
  };

  const updateLikes = async (videoId, isUndo = false) => {
    try {
      const updatelikeflag = isUndo ? "-1" : "1";
      const response = await fetch(
        "https://railwaymcq.com/student/updatevideoviews.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId, updatelikeflag }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  const suggestions = filterDataByKeywords(allVideos, videoData?.title);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [videoData]);

  const handleVideoClicked = (data) => {
    setVideoData({ videoData: data });
    setShowMore(false);
    setLiked(false);
    setDisLiked(false);
    navigate("/Videos/Video-Player");
  };

  const handleshowComment = async (videoId) => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/student/videocomment_api.php?videoId=${videoId}`
      );

      const responseData = await response.json();

      setComments((prevComments) => ({
        ...prevComments,
        [videoId]: responseData.comments || [],
      }));
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
    handleshowComment(videoData?.id);
  };

  const handleCommentChange = (videoId, event) => {
    setCommentInput({ ...commentInput, [videoId]: event.target.value });
  };
  const handleCommentSubmit = async (videoId) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, comment: commentInput[videoId] }),
      };

      const response = await fetch(
        "https://railwaymcq.com/student/videocomment_api.php",
        requestOptions
      );

      const responseData = await response.json();

      if (responseData.success) {
        setComments({
          ...comments,
          [videoId]: [
            ...(comments[videoId] || []),
            { text: commentInput[videoId] },
          ],
        });
        setCommentInput({ ...commentInput, [videoId]: "" });
      } else {
        console.error("Failed to submit comment", responseData.error);
      }
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };
  return (
    <div className="container">
      <GoBackCom page={"Video Player"} link={"/Gallery"} />
      <div className="row">
        <div className="col-12 col-md-8 video-modal">
          <div className="papaDiv">
            <div className="video-wrapper " style={{ borderRadius: "5px" }}>
              <YouTube
                videoId={videoData?.link}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                    origin: window.location.origin, // Ensure this matches the domain
                  },
                }}
                onReady={(event) => event.target.playVideo()}
              />
            </div>
            <h6 className="mt-2">{videoData?.title}</h6>
            <div className="d-flex justify-content-between">
              <div>views: {Number(videoData?.views) + 1}</div>
              <div className="d-flex justify-content-between">
                <div className="me-3" style={{ cursor: "pointer" }}>
                  {!liked ? (
                    <p>
                      <BiLike onClick={() => handleLikeDisLike("like")} />{" "}
                      {videoData?.likes}
                    </p>
                  ) : (
                    <p>
                      <BiSolidLike style={{ fill: "green" }} />{" "}
                      {Number(videoData?.likes) + 1}
                    </p>
                  )}
                </div>
                <div className="me-3" style={{ cursor: "pointer" }}>
                  {!disLiked ? (
                    <p>
                      <BiDislike onClick={() => handleLikeDisLike("dislike")} />{" "}
                      {videoData?.dislikes}
                    </p>
                  ) : (
                    <p>
                      <BiSolidDislike style={{ fill: "red" }} />{" "}
                      {Number(videoData?.dislikes) + 1}
                    </p>
                  )}
                </div>{" "}
              </div>
            </div>
          </div>
          {screenSize.width < 770 ? (
            <div className="mb-2">
              <p
                onClick={() => {
                  setShowMore(!showMore);
                }}
                style={{ cursor: "pointer" }}
              >
                {" "}
                Show More...
              </p>
              {showMore ? (
                <div>
                  <div className="papaDiv">
                    <div className="row position-relative  m-1">
                      <hr />
                      <div
                        className=" position-absolute  ms-4"
                        style={{
                          top: "-17px",
                          background: "White",
                          width: "135px",
                        }}
                      >
                        {" "}
                        <button
                          className="d-flex btn btn-sm  btn-outline-dark"
                          type="button"
                          onClick={toggleCollapse}
                          aria-expanded={isCollapsed}
                          aria-controls="collapseExample"
                          style={{ maxHeight: "37px" }}
                        >
                          Description &nbsp;
                          {!isCollapsed ? (
                            <FaAngleDoubleDown className="mt-1" />
                          ) : (
                            <FaAngleDoubleUp className="mt-1" />
                          )}
                        </button>
                      </div>
                      <div className="mt-2" id="collapseExample">
                        <div style={{ fontSize: "15px" }} className="">
                          {isCollapsed
                            ? videoData?.description
                            : videoData?.description.slice(0, 30) +
                              " ...... read more"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /////////////////////////////////////////// */}
                  <div className="  papaDiv m-1">
                    <div className="row  position-relative">
                      <hr />
                      <div
                        className=" position-absolute  col-4 ms-4"
                        style={{
                          top: "-17px",
                          background: "White",
                          width: "135px",
                        }}
                      >
                        {" "}
                        <button
                          className="  d-flex btn btn-sm btn-outline-dark"
                          type="button"
                          onClick={toggleCollapseCom}
                          aria-controls="collapseExample"
                          style={{ maxHeight: "37px" }}
                        >
                          Comments &nbsp;
                          {!isCollapsedCom ? (
                            <FaAngleDoubleDown className="mt-1" />
                          ) : (
                            <FaAngleDoubleUp className="mt-1" />
                          )}
                        </button>
                      </div>
                      <div className="input-group mt-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          style={{ height: "37px" }}
                          value={commentInput[videoData?.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(videoData?.id, e)
                          }
                          className="form-control Subject"
                        />{" "}
                        <span
                          type="button"
                          className="btn d-flex btn-outline-success Subject"
                          style={{ height: "37px" }}
                          onClick={() => handleCommentSubmit(videoData?.id)}
                        >
                          Comment <IoMdSend className="m-1" />
                        </span>
                      </div>
                      <div
                        style={{
                          overflowY: "auto",
                          overflowX: "hidden",
                          maxHeight: "370px",
                        }}
                        className="scrollspy-example-2 mt-2"
                      >
                        {isCollapsedCom ? (
                          <div className="comments-list">
                            {comments[videoData?.id] &&
                            comments[videoData?.id].length > 0 ? (
                              comments[videoData?.id].map((comment, index) => (
                                <div>
                                  <div className="d-flex justify-content-between">
                                    <FaCircleUser />{" "}
                                    <div style={{ fontSize: "12px" }}>
                                      {comment.created_at}
                                    </div>
                                  </div>
                                  <p key={index} className="comment">
                                    {comment.comment
                                      ? comment.comment
                                      : comment.text}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p>No Comments ...</p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div className="papaDiv ">
                <div className="row position-relative  m-1">
                  <hr />
                  <div
                    className=" position-absolute  ms-4"
                    style={{
                      top: "-17px",
                      background: "White",
                      width: "135px",
                    }}
                  >
                    {" "}
                    <button
                      className="d-flex btn btn-sm  btn-outline-dark"
                      type="button"
                      onClick={toggleCollapse}
                      aria-expanded={isCollapsed}
                      aria-controls="collapseExample"
                      style={{ maxHeight: "37px" }}
                    >
                      Description &nbsp;
                      {!isCollapsed ? (
                        <FaAngleDoubleDown className="mt-1" />
                      ) : (
                        <FaAngleDoubleUp className="mt-1" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2" id="collapseExample">
                    <div style={{ fontSize: "15px" }} className="">
                      {isCollapsed
                        ? videoData?.description
                        : videoData?.description.slice(0, 30) +
                          " ...... read more"}
                    </div>
                  </div>
                </div>
              </div>
              {/* /////////////////////////////////////////// */}
              <div className="  papaDiv m-1">
                <div className="row  position-relative">
                  <hr />
                  <div
                    className=" position-absolute  col-4 ms-4"
                    style={{
                      top: "-17px",
                      background: "White",
                      width: "135px",
                    }}
                  >
                    {" "}
                    <button
                      className="  d-flex btn btn-sm btn-outline-dark"
                      type="button"
                      onClick={toggleCollapseCom}
                      aria-controls="collapseExample"
                      style={{ maxHeight: "37px" }}
                    >
                      Comments &nbsp;
                      {!isCollapsedCom ? (
                        <FaAngleDoubleDown className="mt-1" />
                      ) : (
                        <FaAngleDoubleUp className="mt-1" />
                      )}
                    </button>
                  </div>
                  <div className="input-group mt-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      style={{ height: "37px" }}
                      value={commentInput[videoData?.id] || ""}
                      onChange={(e) => handleCommentChange(videoData?.id, e)}
                      className="form-control Subject"
                    />{" "}
                    <span
                      type="button"
                      className="btn d-flex btn-outline-success Subject"
                      style={{ height: "37px" }}
                      onClick={() => handleCommentSubmit(videoData?.id)}
                    >
                      Comment <IoMdSend className="m-1" />
                    </span>
                  </div>
                  <div
                    style={{
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: "370px",
                    }}
                    className="scrollspy-example-2 mt-2"
                  >
                    {isCollapsedCom ? (
                      <div className="comments-list">
                        {comments[videoData?.id] &&
                        comments[videoData?.id].length > 0 ? (
                          comments[videoData?.id].map((comment, index) => (
                            <div>
                              <div className="d-flex justify-content-between">
                                <FaCircleUser />{" "}
                                <div style={{ fontSize: "12px" }}>
                                  {comment.created_at}
                                </div>
                              </div>
                              <p key={index} className="comment">
                                {comment.comment
                                  ? comment.comment
                                  : comment.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No Comments ...</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ////////////////////////////////////////// */}
        </div>
        <div
          className="col-12 col-md-4 papaDiv"
          style={{ marginRight: "0px", paddingRight: "0px" }}
        >
          <h6> Suggestion</h6>
          <div
            style={{
              marginRight: "0px",
              paddingRight: "0px",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "1000px",
            }}
            className="scrollspy-example-2 "
          >
            <div className="  m-2">
              {suggestions.slice(0, 35).map((item, idx) => (
                <div
                  className="row ps-2 pb-1 pe-1 mb-2 Subject underline "
                  key={idx}
                >
                  <div
                    className={`col-10  ${
                      screenSize.width < 770 ? "col-md-12" : "col-md-5"
                    }  `}
                    style={{
                      position: "relative",
                      maxHeight: "200px",

                      paddingTop:
                        screenSize.width < 770 ? `` : `${(56.2 * 5) / 12}%`,

                      borderRadius: "10px",
                    }}
                  >
                    <img
                      className={`Subject ${
                        screenSize.width < 770 ? "ms-4" : ""
                      }  `}
                      src={`https://img.youtube.com/vi/${item.link}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      onClick={() => {
                        handleVideoClicked({ ...item, from: videoData?.from });
                      }}
                      style={{
                        position: screenSize.width < 770 ? "" : "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div
                    className={`col-12 ${
                      screenSize.width < 770 ? "mt-2 ms-4" : "col-md-7"
                    }`}
                  >
                    <b className="text-start" style={{ fontSize: "13px" }}>
                      {item.title.slice(0, 50)} ...
                    </b>
                    <div className="text-start" style={{ fontSize: "12px" }}>
                      Views: {item.views} Likes: {item.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
