import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import axios from "axios";
import GoBackCom from "../GoBackCom";
import ReplyFrom from "./ReplyFrom";
import { SlLike, SlDislike } from "react-icons/sl";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import UserList from "./UserList";
import { BiFontSize } from "react-icons/bi";
import ChatBox from "./ChatBox";

const StartThread = () => {
  const { selectedThread } = useGlobalContext();
  const [replies, setReplies] = useState(selectedThread?.replies || []);
  const [openMenu, setOpenMenu] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [threadLikes, setThreadLikes] = useState(selectedThread?.postlike || 0);
  const [threadDislikes, setThreadDislikes] = useState(
    selectedThread?.postdislike || 0
  );
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [userReplyInteractions, setUserReplyInteractions] = useState(
    selectedThread?.replies?.reduce((acc, reply) => {
      acc[reply.id] = { liked: false, disliked: false };
      return acc;
    }, {}) || {}
  );
  // const chatEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [replies]);

  const fetchReplies = async () => {
    try {
      const response = await axios.get(
        `https://railwaymcq.com/railwaymcq/RailPariksha/post_reply_api.php?thread_id=${selectedThread?.id}`
      );
      setReplies(response.data);
    } catch (error) {
      console.error("There was an error fetching the replies!", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [selectedThread?.id]);

  const handleReplyPosted = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  const handleView = () => {
    axios
      .put(
        "https://railwaymcq.com/railwaymcq/RailPariksha/post_thread_api.php",
        {
          id: selectedThread?.id,
          views: true,
        }
      )
      .then(() => {})
      .catch((error) => {
        console.error("There was an error updating the view count!", error);
      });
  };

  useEffect(() => {
    handleView();
  }, [selectedThread?.id]);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  const handleLike = () => {
    if (!userLiked) {
      const newLikes = threadLikes + 1;
      const newDislikes = userDisliked ? threadDislikes - 1 : threadDislikes;

      setThreadLikes(newLikes);
      setThreadDislikes(newDislikes);
      setUserLiked(true);
      setUserDisliked(false);

      axios
        .put(
          "https://railwaymcq.com/railwaymcq/RailPariksha/post_thread_api.php",
          {
            id: selectedThread?.id,
            likes: newLikes,
            dislikes: newDislikes,
          }
        )
        .then(() => {})
        .catch((error) => {
          console.error("There was an error updating the like count!", error);
        });
    }
  };

  const handleDislike = () => {
    if (!userDisliked) {
      const newDislikes = threadDislikes + 1;
      const newLikes = userLiked ? threadLikes - 1 : threadLikes;

      setThreadDislikes(newDislikes);
      setThreadLikes(newLikes);
      setUserDisliked(true);
      setUserLiked(false);

      axios
        .put(
          "https://railwaymcq.com/railwaymcq/RailPariksha/post_thread_api.php",
          {
            id: selectedThread?.id,
            likes: newLikes,
            dislikes: newDislikes,
          }
        )
        .then(() => {})
        .catch((error) => {
          console.error(
            "There was an error updating the dislike count!",
            error
          );
        });
    }
  };

  const handleReplyLike = (replyId) => {
    if (!userReplyInteractions[replyId]?.liked) {
      const newReplies = replies.map((reply) => {
        if (reply.id === replyId) {
          const newLikes = reply.likes + 1;
          const newDislikes = userReplyInteractions[replyId]?.disliked
            ? reply.dislikes - 1
            : reply.dislikes;

          return { ...reply, likes: newLikes, dislikes: newDislikes };
        }
        return reply;
      });

      setReplies(newReplies);
      setUserReplyInteractions((prevState) => ({
        ...prevState,
        [replyId]: { liked: true, disliked: false },
      }));

      const currentReply = newReplies.find((reply) => reply.id === replyId);

      axios
        .put(
          "https://railwaymcq.com/railwaymcq/RailPariksha/post_reply_api.php",
          {
            id: replyId,
            likes: currentReply.likes,
            dislikes: currentReply.dislikes,
          }
        )
        .then(() => {})
        .catch((error) => {
          console.error(
            "There was an error updating the reply like count!",
            error
          );
        });
    }
  };

  const handleReplyDislike = (replyId) => {
    if (!userReplyInteractions[replyId]?.disliked) {
      const newReplies = replies.map((reply) => {
        if (reply.id === replyId) {
          const newDislikes = reply.dislikes + 1;
          const newLikes = userReplyInteractions[replyId]?.liked
            ? reply.likes - 1
            : reply.likes;

          return { ...reply, dislikes: newDislikes, likes: newLikes };
        }
        return reply;
      });

      setReplies(newReplies);
      setUserReplyInteractions((prevState) => ({
        ...prevState,
        [replyId]: { liked: false, disliked: true },
      }));

      const currentReply = newReplies.find((reply) => reply.id === replyId);

      axios
        .put(
          "https://railwaymcq.com/railwaymcq/RailPariksha/post_reply_api.php",
          {
            id: replyId,
            likes: currentReply.likes,
            dislikes: currentReply.dislikes,
          }
        )
        .then(() => {})
        .catch((error) => {
          console.error(
            "There was an error updating the reply dislike count!",
            error
          );
        });
    }
  };

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

  const handleBtnClick = (btn) => {
    if (btn === "menu") {
      setOpenMenu(!openMenu);
    }
  };

  return (
    <div className="container papaDiv">
      <GoBackCom page={"Start Discussion"} link={"/MyIdeas"} />
      <div className="row">
        <div className="col-12 col-md-3">
          {screenSize.width < 770 ? (
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-sm btn-outline-darK"
                onClick={() => handleBtnClick("menu")}
              >
                <GiHamburgerMenu />
              </button>
            </div>
          ) : (
            <div>
              <UserList replies={replies} selectedThread={selectedThread} />
            </div>
          )}
          {openMenu && (
            <div
              style={{
                margin: "0",
                position: "fixed",
                top: "0",
                left: "0",
                height: "100vh",
                width: "100vw",
                zIndex: 2,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
              onClick={() => setOpenMenu(false)}
            >
              <div
                className="position-relative p-2"
                style={{
                  boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                  background: "white",
                  borderRadius: "15px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
                  style={{
                    height: "20px",
                    width: "20px",
                    cursor: "pointer",
                    background: "white",
                    borderRadius: "50%",
                    zIndex: "100",
                  }}
                  onClick={() => setOpenMenu(false)}
                >
                  <IoCloseCircleSharp
                    style={{
                      height: "15px",
                      width: "15px",
                      color: "grey",
                    }}
                  />
                </div>
                <UserList replies={replies} selectedThread={selectedThread} />
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-md-9">
          <div className="papaDiv">
            <div
              className="  scrollspy-example-2"
              style={{
                height: "150px",
                overflowY: "auto",
              }}
            >
              <div className=" " style={{ height: "150px" }}>
                <div>
                  <h6 className="">{selectedThread?.title}</h6>
                </div>

                <div style={{ fontSize: "13px" }}>
                  {selectedThread?.content}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <button
                className={`btn btn-sm me-2 ${
                  userLiked ? "btn-success" : "btn-outline-success"
                }`}
                onClick={handleLike}
                disabled={userLiked}
              >
                <SlLike /> {threadLikes}
              </button>
              <button
                className={`btn btn-sm me-2 ${
                  userDisliked ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={handleDislike}
                disabled={userDisliked}
              >
                <SlDislike /> {threadDislikes}
              </button>
            </div>
          </div>
          <ChatBox
            replies={replies}
            selectedThread={selectedThread}
            userReplyInteractions={userReplyInteractions}
            handleReplyLike={handleReplyLike}
            handleReplyDislike={handleReplyDislike}
          />
          {/* <div
            className="scrollspy-example-2"
            style={{
              height: "350px",
              overflowY: "auto",
            }}
          >
            <div className="" style={{ height: "350px" }}>
              {console.log(replies)}
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <div key={reply.id} className="">
                    {Number(selectedThread?.uid) === Number(reply?.user_id) ? (
                      <div className="row mb-2">
                        <div className="col-8 ms-2">
                          <div className="text-start">
                            <h6
                              style={{ fontSize: "12px", marginBottom: "0px" }}
                            >
                              {reply?.uname}
                            </h6>
                            <div style={{ fontSize: "12px", marginTop: "0px" }}>
                              {reply?.created_at.slice(0, 16)}
                            </div>
                          </div>
                          <div
                            className="papaDiv position-relative mt-3"
                            style={{
                              fontSize: "13px",
                              background: "#cbf2a6",
                              marginBottom: "0px",
                            }}
                          >
                            <div
                              className="position-absolute top-0 translate-middle mr-2"
                              style={{
                                width: "0",
                                height: "0",
                                left: "25px",
                                borderLeft: "12px solid transparent",
                                borderRight: "12px solid transparent",
                                borderBottom: "26px solid #cbf2a6",
                              }}
                            ></div>
                            {reply.content}
                          </div>
                          <div
                            className="d-flex justify-content-end align-items-center"
                            style={{ marginTop: "0px" }}
                          >
                            <button
                              className={`btn btn-sm me-2 Subject ${
                                userReplyInteractions[reply.id]?.liked
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleReplyLike(reply.id)}
                              disabled={userReplyInteractions[reply.id]?.liked}
                            >
                              <SlLike /> {reply.likes}
                            </button>
                            <button
                              className={`btn btn-sm me-2 Subject ${
                                userReplyInteractions[reply.id]?.disliked
                                  ? "btn-danger"
                                  : "btn-outline-danger"
                              }`}
                              onClick={() => handleReplyDislike(reply.id)}
                              disabled={
                                userReplyInteractions[reply.id]?.disliked
                              }
                            >
                              <SlDislike /> {reply.dislikes}
                            </button>
                          </div>
                        </div>
                        <div className="col-4"></div>
                      </div>
                    ) : Number(reply?.user_id) === 0 ? (
                      <div className="row me-2 mb-2">
                        <div className="col-4"></div>
                        <div className="col-8">
                          <div className="text-end">
                            <h6
                              style={{ fontSize: "12px", marginBottom: "0px" }}
                            >
                              {reply?.uname}
                            </h6>
                            <div style={{ fontSize: "12px", marginTop: "0px" }}>
                              {reply?.created_at.slice(0, 16)}
                            </div>
                          </div>
                          <div
                            className="papaDiv position-relative mt-3"
                            style={{
                              fontSize: "13px",
                              background: "#f2a6a6",
                              marginBottom: "0px",
                            }}
                          >
                            <div
                              className="position-absolute top-0 end-0 translate-middle mr-2"
                              style={{
                                width: "0",
                                height: "0",
                                borderLeft: "12px solid transparent",
                                borderRight: "12px solid transparent",
                                borderBottom: "26px solid #f2a6a6",
                              }}
                            ></div>
                            {reply.content}
                          </div>
                          <div
                            className="d-flex justify-content-end align-items-center"
                            style={{ marginTop: "0px" }}
                          >
                            <button
                              className={`btn btn-sm me-2 Subject ${
                                userReplyInteractions[reply.id]?.liked
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleReplyLike(reply.id)}
                              disabled={userReplyInteractions[reply.id]?.liked}
                            >
                              <SlLike /> {reply.likes}
                            </button>
                            <button
                              className={`btn btn-sm me-2 Subject ${
                                userReplyInteractions[reply.id]?.disliked
                                  ? "btn-danger"
                                  : "btn-outline-danger"
                              }`}
                              onClick={() => handleReplyDislike(reply.id)}
                              disabled={
                                userReplyInteractions[reply.id]?.disliked
                              }
                            >
                              <SlDislike /> {reply.dislikes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-2 me-2">
                        <div className="col-4"></div>
                        <div className="col-8">
                          <div className="text-end">
                            <h6
                              style={{ fontSize: "12px", marginBottom: "0px" }}
                            >
                              {reply?.uname}
                            </h6>
                            <div style={{ fontSize: "12px", marginTop: "0px" }}>
                              {reply?.created_at.slice(0, 16)}
                            </div>
                          </div>
                          <div
                            className="papaDiv position-relative mt-3"
                            style={{
                              fontSize: "13px",
                              background: "#a6b6f2",
                              width: "auto",
                              marginBottom: "0px",
                            }}
                          >
                            <div
                              className="position-absolute top-0 end-0 translate-middle mr-2"
                              style={{
                                width: "0",
                                height: "0",
                                borderLeft: "12px solid transparent",
                                borderRight: "12px solid transparent",
                                borderBottom: "26px solid #a6b6f2",
                              }}
                            ></div>
                            {reply.content}
                          </div>
                          <div
                            className="d-flex justify-content-end align-items-center"
                            style={{ marginTop: "0px" }}
                          >
                            <button
                              className={`btn btn-sm me-2 Subject ${
                                userReplyInteractions[reply.id]?.liked
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleReplyLike(reply.id)}
                              disabled={userReplyInteractions[reply.id]?.liked}
                            >
                              <SlLike /> {reply.likes}
                            </button>
                            <button
                              className={`btn btn-sm me-2 Subject ${
                                userReplyInteractions[reply.id]?.disliked
                                  ? "btn-danger"
                                  : "btn-outline-danger"
                              }`}
                              onClick={() => handleReplyDislike(reply.id)}
                              disabled={
                                userReplyInteractions[reply.id]?.disliked
                              }
                            >
                              <SlDislike /> {reply.dislikes}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No replies yet</p>
              )}
              <div ref={chatEndRef} />
            </div>
          </div> */}
          <div className="papaDiv">
            {" "}
            <ReplyFrom
              onReplyPosted={handleReplyPosted}
              threadId={selectedThread?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartThread;
