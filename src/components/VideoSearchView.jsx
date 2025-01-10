import React, { useState } from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

import { useGlobalContext } from "../Context/GlobalContextOne";

import { useNavigate } from "react-router-dom";
const VideoSearchView = ({ currentVideos, filteredVideos }) => {
  const { setVideoData } = useGlobalContext();
  const navigate = useNavigate();
  const handleVideoClicked = (data) => {
    setVideoData({ videoData: data });
    navigate("/Videos/Video-Player");
  };

  const [currentCount, setCurrentCount] = useState(16);

  const handleShowMore = () => {
    setCurrentCount(currentCount + 16);
  };

  const handleShowLess = () => {
    setCurrentCount(currentCount - 16);
  };

  return (
    <div className=" papaDiv">
      <h6>Search Result {filteredVideos?.length} Video Found</h6>
      <hr />

      <div className="row">
        {filteredVideos?.slice(0, currentCount).map((item, idx) => (
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
                onClick={() => handleVideoClicked({ ...item, from: "/Videos" })}
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
              {item.title}
            </p>
            <p className="text-start" style={{ fontSize: "12px" }}>
              Views: {item.views} Likes: {item.likes}
            </p>
          </div>
        ))}

        <hr />
      </div>
      <div className="d-flex justify-content-center">
        {filteredVideos.length > currentCount && (
          <button
            onClick={handleShowMore}
            className="ms-2 me-2 btn-sm btn btn-outline-dark Subject"
          >
            Show More <FaAngleDoubleDown />
          </button>
        )}
        {currentCount > 16 && (
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
export default VideoSearchView;
