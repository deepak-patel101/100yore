import React, { useState, useEffect } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import GoBack from "./comps/GoBack";
import { MdOutlinePlayCircleFilled } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const VideoApproval = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(selectedVideo?.link);
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/pendingVideos.php"
      );
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (videoId) => {
    try {
      await axios.post(
        `https://railwaymcq.com/student/approveVideo.php?id=${videoId}`
      );
      setVideos(videos.filter((video) => video.id !== videoId));
      alert("Video approved successfully");
    } catch (error) {
      console.error("Error approving video:", error);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  const openVideoInNewTab = (video) => {
    window.open(`https://www.youtube.com/watch?v=${video.link}`, "_blank");
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="container papaDiv">
      <GoBack page={"Video Approval"} />

      <div className="row">
        <div className="col-12 col-md-7 papaDiv ">
          <h5>
            <FaVideo /> video player
          </h5>
          <hr />
          {selectedVideo ? (
            <div className="video-modal" style={{ maxHeight: "470px" }}>
              <h5>
                <b>Title:</b>
                {selectedVideo.title}
              </h5>
              <hr />
              <div className="video-wrapper">
                <YouTube
                  videoId={selectedVideo.link}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  onReady={(event) => event.target.playVideo()}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="text-end Subject btn btn-sm btn-outline-danger m-1"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="col-12 col-md m-1 ">
          <div className="mt-2 mb-2 d-flex justify-content-between">
            <h5>
              <FaClipboardList /> video list{" "}
            </h5>{" "}
            <div>Total Videos:{videos.length}</div>
          </div>
          <hr />
          {isLoading ? (
            <p>
              <AiOutlineLoading3Quarters />
              Loading.......
            </p>
          ) : (
            <div
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "500px",
              }}
              className="scrollspy-example-2 m-2"
            >
              {videos.length === 0 ? (
                <p>No videos pending approval</p>
              ) : (
                videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="Subject underline ps-2 pb-2 me-2 mb-2  scrollspy-example-2"
                    style={{
                      borderRadius: "5px",
                      // background:
                      //   selectedVideo !== null &&
                      //   selectedVideo.link === video.link
                      //     ? "#B7D8EE"
                      //     : null,
                      border:
                        selectedVideo !== null &&
                        selectedVideo.link === video.link
                          ? "2px solid black"
                          : null,
                    }}
                  >
                    <p>
                      <b>{index + 1}</b> <strong>Title:</strong> {video.title}
                    </p>
                    <div className="row mb-2">
                      <div className="col-4">
                        <button
                          className="btn btn-sm btn-outline-primary Subject"
                          onClick={() => handleSelectVideo(video)}
                        >
                          <MdOutlinePlayCircleFilled /> Play
                        </button>
                      </div>
                      <div className="col-4">
                        <button
                          className="btn btn-sm btn-outline-success Subject"
                          onClick={() => handleApprove(video.id)}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoApproval;
