import React, { useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { MdTopic } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Context/GlobalContextOne";
import YouTube from "react-youtube";

const VideoHomeView = ({ sortedByViews }) => {
  const { setVideoData } = useGlobalContext();
  const [currentCount, setCurrentCount] = useState(4);
  const [currentCountVideo, setCurrentCountVideo] = useState({});

  const navigate = useNavigate();

  const handleShowMore = () => {
    setCurrentCount(currentCount + 4);
  };

  const handleShowLess = () => {
    setCurrentCount(currentCount - 4);
  };

  const handleShowMoreVideo = (sub) => {
    setCurrentCountVideo((prev) => ({
      ...prev,
      [sub]: (prev[sub] || 8) + 8,
    }));
  };

  const handleShowLessVideo = (sub) => {
    setCurrentCountVideo((prev) => ({
      ...prev,
      [sub]: (prev[sub] || 8) - 8,
    }));
  };

  const handleVideoClicked = (data) => {
    setVideoData({ videoData: data });
    navigate("/Videos/Video-Player");
  };

  return (
    <div className="">
      {sortedByViews.slice(0, currentCount).map((objects, index) => {
        const videoCount = currentCountVideo[objects.sub] || 8;
        return (
          <div className="row papaDiv  mb-2" key={index}>
            <div className="d-flex justify-content-between m-2">
              {/* <h6>
                <MdTopic /> {objects.sub}
              </h6> */}
              <h6>video: {objects.items.length}</h6>
            </div>
            {/* Render items within each group */}
            <div className="row ">
              {objects.items.slice(0, videoCount).map((item, idx) => (
                <div className="col-12 col-md-3 mb-3" key={idx}>
                  <div
                    className="card Subject"
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${item.link}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      onClick={() =>
                        handleVideoClicked({ ...item, from: "/Videos" })
                      }
                      style={{
                        position: "absolute",
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
                  <p
                    className="text-start"
                    style={{ fontWeight: "bold", fontSize: "13px" }}
                  >
                    {item.title.slice(0, 45)}...
                  </p>
                  <p className="text-start" style={{ fontSize: "12px" }}>
                    Views: {item.views} Likes: {item.likes}
                  </p>
                </div>
              ))}

              <div className="row position-relative">
                <hr />
                <div
                  className=" position-absolute  me-4"
                  style={{
                    left: "70%",
                    top: "-17px",
                    background: "White",
                    maxWidth: "205px",
                  }}
                >
                  {" "}
                  <div className="d-flex justify-content-center">
                    {objects.items.length > videoCount && (
                      <button
                        onClick={() => handleShowMoreVideo(objects.sub)}
                        className="ms-2 me-2 d-flex btn-sm btn btn-outline-dark Subject"
                      >
                        More <FaAngleDoubleDown className="m-1" />
                      </button>
                    )}
                    {videoCount > 8 && (
                      <button
                        onClick={() => handleShowLessVideo(objects.sub)}
                        className="ms-2 me-2 btn-sm btn btn-outline-dark Subject"
                      >
                        <FaAngleDoubleUp /> Less
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Conditionally render the "Show More" or "Show Less" button */}
      <hr />
      <div className="d-flex justify-content-center">
        {sortedByViews.length > currentCount && (
          <button
            onClick={handleShowMore}
            className="ms-2 me-2 btn-sm btn btn-outline-dark Subject"
          >
            More Departments <FaAngleDoubleDown />
          </button>
        )}
        {currentCount > 4 && (
          <button
            onClick={handleShowLess}
            className="ms-2 me-2 btn-sm btn btn-outline-dark Subject"
          >
            <FaAngleDoubleUp /> Show Less
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoHomeView;
