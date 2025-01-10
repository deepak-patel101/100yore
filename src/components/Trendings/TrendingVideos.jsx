import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { MdOutlineOndemandVideo, MdTopic } from "react-icons/md";
import GoBackCom from "../GoBackCom";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context/GlobalContextOne";

const TrendingVideos = ({ from }) => {
  const [trendingData, setTrendingData] = useState(null);
  const [videoDataToShow, setVideoDataToShow] = useState(null);
  const [trendingDataForHome, setTrendingDataForHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setVideoData, videoData } = useGlobalContext();
  const [currentCountVideo, setCurrentCountVideo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (from === "home" && trendingData) {
      setTrendingDataForHome({ Trending_Videos: trendingData.Trending_Videos });
    } else {
      setVideoDataToShow(trendingData);
    }
  }, [from, trendingData]);

  useEffect(() => {
    if (from === "home" && trendingDataForHome) {
      setVideoDataToShow(trendingDataForHome);
    }
  }, [from, trendingDataForHome]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://railwaymcq.com/railwaymcq/100YoRE/TrendingVideo.php"
        );
        const data = await response.json();
        setTrendingData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShowMoreVideo = (sub) => {
    setCurrentCountVideo((prev) => ({
      ...prev,
      [sub]:
        (prev[sub] || (from === "home" ? 4 : 8)) + (from === "home" ? 4 : 8),
    }));
  };

  const handleShowLessVideo = (sub) => {
    setCurrentCountVideo((prev) => ({
      ...prev,
      [sub]:
        (prev[sub] || (from === "home" ? 4 : 8)) - (from === "home" ? 4 : 8),
    }));
  };

  const handleVideoClicked = (data) => {
    setVideoData({ videoData: data });
    navigate("/Videos/Video-Player");
  };

  return (
    <div className={`container ${from === "home" ? "papaDiv" : ""} `}>
      {from === "home" ? (
        <div className="text-start">
          <h5>
            <MdOutlineOndemandVideo />
            &nbsp; Must Watch
          </h5>
        </div>
      ) : (
        <GoBackCom link={"/Trending"} page={"Trending Videos"} />
      )}

      <div>{loading ? <Loading /> : null} </div>
      {videoDataToShow &&
        Object.entries(videoDataToShow)?.map(([title, objects], index) => {
          const videoCount =
            currentCountVideo[title] || (from === "home" ? 4 : 8);

          return (
            <div
              className={`row ${from === "home" ? "" : "papaDiv"} mb-2`}
              key={index}
            >
              <div className="d-flex justify-content-between m-2">
                {from === "home" ? null : (
                  <h5>
                    <MdTopic /> {title.replace("_", " ")}
                  </h5>
                )}
              </div>
              <div className="row">
                {objects?.slice(0, videoCount).map((item, idx) => (
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
                          handleVideoClicked({ ...item, from: "/" })
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
                      {item.title}
                    </p>
                    <p className="text-start" style={{ fontSize: "12px" }}>
                      Views: {item.views} Likes: {item.likes}
                    </p>
                  </div>
                ))}

                <div className="row position-relative">
                  <hr />
                  <div
                    className="position-absolute me-4"
                    style={{
                      left: "70%",
                      top: "-17px",
                      background: "white",
                      maxWidth: "205px",
                    }}
                  >
                    <div className="d-flex justify-content-center">
                      {objects?.length > videoCount && (
                        <button
                          onClick={() => handleShowMoreVideo(title)}
                          className="ms-2 me-2 d-flex btn-sm btn btn-outline-dark Subject"
                        >
                          More <FaAngleDoubleDown className="m-1" />
                        </button>
                      )}

                      {videoCount > (from === "home" ? 4 : 8) && (
                        <button
                          onClick={() => handleShowLessVideo(title)}
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
    </div>
  );
};

export default TrendingVideos;
