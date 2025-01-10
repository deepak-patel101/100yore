import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { MdNearbyError, MdOutlineOndemandVideo, MdTopic } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Context/GlobalContextOne";

import GoBackCom from "./GoBackCom";

const HomeSearchedVideo = () => {
  const [videoDataToShow, setVideoDataToShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const { setVideoData, videoData, SearchKeyWord } = useGlobalContext();
  const [currentCountVideo, setCurrentCountVideo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://railwaymcq.com/railwaymcq/RailPariksha/Home_Search_Result.php?search=${encodeURIComponent(
            SearchKeyWord
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setVideoDataToShow(data); // Update state with the result
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(
    //       "https://railwaymcq.com/railwaymcq/RailPariksha/TrendingVideo.php"
    //     );
    //     const data = await response.json();
    //     setTrendingData(data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching data: ", error);
    //     setLoading(false);
    //   }
    // };

    fetchData();
  }, [SearchKeyWord]);

  const handleShowMoreVideo = (sub) => {
    setCurrentCountVideo((prev) => ({
      ...prev,
      [sub]: (prev[sub] || 4) + 4,
    }));
  };

  const handleShowLessVideo = (sub) => {
    setCurrentCountVideo((prev) => ({
      ...prev,
      [sub]: (prev[sub] || 4) - 4,
    }));
  };

  const handleVideoClicked = (data) => {
    setVideoData({ videoData: data });
    navigate("/Videos/Video-Player");
  };

  return (
    <div className={`container papaDiv `}>
      <h5 className=" text-start">
        <MdOutlineOndemandVideo />
        &nbsp;Video Search Result For {SearchKeyWord}
      </h5>
      Coming Soon!...
      {/* <div className="text-start">
        <h5>
          <MdOutlineOndemandVideo />
          &nbsp; Search Result For {SearchKeyWord}
        </h5>
      </div>
      <div>
        Embrace the world of video tutorials, where learning is no longer
        confined to textbooks, but enriched with real-time demonstrations and
        practical insights.
      </div>

      {videoDataToShow?.[0].length === 0 ? null : (
        <div className="text-end">
          {videoDataToShow?.[0].length} Videos found
        </div>
      )}
      <div>{loading ? <Loading /> : null} </div>
      {videoDataToShow &&
        Object.entries(videoDataToShow)?.map(([title, objects], index) => {
          const videoCount = currentCountVideo[title] || 4;

          return (
            <div className={`row  mb-2`} key={index}>
              <div className="d-flex justify-content-between m-2"></div>
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

                      {videoCount > 4 && (
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
      {
        <div className="text-center" style={{ color: "red" }}>
          {" "}
          {videoDataToShow?.[0].length === 0 ? (
            <div>
              {" "}
              <MdNearbyError /> No Videos found{" "}
            </div>
          ) : null}
        </div>
      } */}
    </div>
  );
};

export default HomeSearchedVideo;
