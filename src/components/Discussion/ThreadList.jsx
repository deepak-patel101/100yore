import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { SlLike, SlDislike } from "react-icons/sl";
import { FaUserCircle } from "react-icons/fa";
import throttle from "lodash/throttle";
import { useUserContext } from "../../Context/UserContext";
import VideoLearner from "../VideoLearner";
import PhotoGallery from "./PhotoGallery";
import { MdDelete } from "react-icons/md";

function ThreadList({ threadsUpdated, newThreadPosted }) {
  const { user } = useUserContext();
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stopFetching, setStopFetching] = useState(false);
  const { setThreadData, threadControl } = useGlobalContext();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Function to fetch data from the API
  const fetchData = async (offset) => {
    if (stopFetching) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/thread_feed_page_api.php?offset=${offset}&limit=1000&search=${threadControl.search}&explore=${threadControl.explore}`
      );
      // changethe limit to 5 from 1000
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }

      const newItems = await response.json();
      if (newItems.length < 5) {
        setStopFetching(true);
      }
      setItems((prevItems) => [...prevItems, ...newItems]);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Reset items and offset whenever search, feed, or explore parameters change
  useEffect(() => {
    setItems([]);
    setOffset(0);
    setStopFetching(false);
  }, [
    threadControl.search,
    threadControl.feed,
    threadControl.explore,
    newThreadPosted,
  ]);
  // useEffect(() => {
  //   fetchData();
  // }, [newThreadPosted]);
  // Load more data when scrolling to the bottom of the container

  const handleScroll = useCallback(
    throttle(() => {
      const container = containerRef.current;
      if (container) {
        if (
          container.scrollHeight - container.scrollTop ===
          container.clientHeight
        ) {
          setOffset((prevOffset) => prevOffset + 5);
        }
      }
    }, 200),
    [stopFetching]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // Fetch data whenever offset or stopFetching changes
  useEffect(() => {
    if (!stopFetching) {
      fetchData();
    }
    // }, [offset, stopFetching, threadControl.explore]);
  }, [stopFetching, threadControl.explore, newThreadPosted]);

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  // Handler for selecting a thread
  const handleSelectedThread = (data) => {
    setThreadData({ selectedThread: data });
    navigate("/MyIdeas/Start-Discussion");
  };

  // Handler for deleting a thread
  const handleDelete = async (data) => {
    const isConfirmed = window.confirm(
      "Are you sure? Once deleted, this cannot be restored."
    );

    if (!isConfirmed) {
      return;
    }

    if (!data?.id) {
      setError("ID is required");
      return;
    }

    const deleteId = data.id;

    try {
      setError(null);

      const res = await fetch(
        "https://railwaymcq.com/railwaymcq/100YoRE/Delete_thread.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: deleteId }),
        }
      );

      // Log the status and response to check what is returned
      const result = await res.json();

      if (res.ok) {
        alert(result.success || "Record deleted successfully");
        setItems((prevItems) =>
          prevItems.filter((thread) => thread.id !== deleteId)
        );
      } else {
        setError(result.error || "An error occurred during deletion");
      }
    } catch (err) {
      setError("Failed to connect to the server");
      console.error("Fetch error:", err); // Log the actual error
    }
  };

  return (
    <div
      className="scrollspy-example-2"
      ref={containerRef}
      style={{
        height: "600px",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <div className="text-center">
        <h5>{threadControl.explore}</h5>
        <hr />
      </div>
      {["Slogans", "Poems", "Other", ""].includes(threadControl.explore) ? (
        <div style={{ height: "600px" }}>
          {items?.map((thread) => {
            return (
              (user?.login_type === "admin" ||
                Number(user?.id) === Number(thread.uid)) && (
                <div key={thread.id}>
                  {" "}
                  <Card key={thread.id} className="mb-3 Subject">
                    <div className="d-flex justify-content-between">
                      <div>
                        <FaUserCircle
                          style={{ marginRight: "8px", color: "green" }}
                        />
                        <span>{thread.uname}</span>
                      </div>
                      <div style={{ fontSize: "10px" }}>
                        Posted On{" "}
                        {new Date(thread.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSelectedThread(thread)}
                      >
                        {thread.title}
                      </Card.Title>
                      <Card.Text
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSelectedThread(thread)}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: thread.content }}
                          style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                          }}
                        />
                      </Card.Text>
                      <hr />
                      <div
                        className="d-flex justify-content-around"
                        style={{ height: "10px" }}
                      >
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectedThread(thread)}
                        >
                          <SlLike className="m-1" size={15} />
                          <div className="ms-2">{thread.likes}</div>{" "}
                          &#160;&#160;
                          <SlDislike className="m-1" size={15} />
                          <div className="ms-2">{thread.dislikes}</div>
                        </div>

                        <div>Views {thread.views}</div>

                        {(user?.login_type === "admin" ||
                          Number(user?.id) === Number(thread.uid)) && (
                          <div style={{ color: "red", cursor: "pointer" }}>
                            <MdDelete onClick={() => handleDelete(thread)} />
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )
            );
          })}

          {/* ////////////////////// */}

          {/* ////////////////////////// */}
          {stopFetching && (
            <div className="alert alert-primary">No more threads</div>
          )}
          {loading && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
        </div>
      ) : null}
      {threadControl.explore === "Videos" && <VideoLearner from={"home"} />}
      {threadControl.explore === "Photos" && <PhotoGallery />}
    </div>
  );
}

export default ThreadList;
