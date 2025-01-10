import React, { useEffect, useRef, useState } from "react";
import { SlDislike, SlLike } from "react-icons/sl";

const ChatBox = ({
  replies,
  selectedThread,
  userReplyInteractions,
  handleReplyLike,
  handleReplyDislike,
}) => {
  const chatBoxRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (autoScroll) {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (chatBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
      // Check if the user is close to the bottom
      if (scrollHeight - scrollTop - clientHeight < 50) {
        setAutoScroll(true);
      } else {
        setAutoScroll(false);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [replies]);

  useEffect(() => {
    const chatBoxElement = chatBoxRef.current;
    chatBoxElement?.addEventListener("scroll", handleScroll);

    return () => {
      chatBoxElement?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="scrollspy-example-2"
      style={{
        height: "350px",
        overflowY: "auto",
      }}
      ref={chatBoxRef}
    >
      <div className="" style={{ height: "350px" }}>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className="">
              {Number(selectedThread?.uid) === Number(reply?.user_id) ? (
                <div className="row mb-2">
                  <div className="col-8 ms-2">
                    <div className="text-start">
                      <h6 style={{ fontSize: "12px", marginBottom: "0px" }}>
                        {reply?.uname}
                      </h6>
                      <div style={{ fontSize: "12px", marginTop: "0px" }}>
                        {reply?.created_at?.slice(0, 16)}
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
                        disabled={userReplyInteractions[reply.id]?.disliked}
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
                      <h6 style={{ fontSize: "12px", marginBottom: "0px" }}>
                        {reply?.uname}
                      </h6>
                      <div style={{ fontSize: "12px", marginTop: "0px" }}>
                        {reply?.created_at?.slice(0, 16)}
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
                        disabled={userReplyInteractions[reply.id]?.disliked}
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
                      <h6 style={{ fontSize: "12px", marginBottom: "0px" }}>
                        {reply?.uname}
                      </h6>
                      <div style={{ fontSize: "12px", marginTop: "0px" }}>
                        {reply?.created_at?.slice(0, 16)}
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
                        disabled={userReplyInteractions[reply.id]?.disliked}
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
      </div>
    </div>
  );
};

export default ChatBox;
