import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Loading";
import "./PhotoCase.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GrFormPrevious, GrNext } from "react-icons/gr";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import GoBackCom from "../GoBackCom";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import { RiGalleryFill } from "react-icons/ri";
const PhotoShowCaseForHome = () => {
  const { setThreadControlData, threadControlData, activePage } =
    useGlobalContext();
  const location = useLocation();
  const category = "RANDOM";
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reload, setReload] = useState(true);
  const [autoPlayCount, setAutoPlayCount] = useState(0);

  const navigate = useNavigate();
  const handleClick = (category) => {
    setThreadControlData({ ...threadControlData, explore: "Photos" });
    navigate("/Gallery");
  };
  useEffect(() => {
    if (activePage === "home") {
      const fetchPhotos = async () => {
        try {
          const response = await fetch(
            `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_Photo.php?category=RANDOM`
          );
          const result = await response.json();

          if (result.success) {
            setPhotos(result.data);
          } else {
            setError(result.error);
          }
        } catch (err) {
          setError("Failed to fetch photos.");
        } finally {
          setLoading(false);
        }
      };
      fetchPhotos();
    }
  }, [activePage, category, reload]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  useEffect(() => {
    if (!loading) {
      if (autoPlay) {
        const timeoutId = setTimeout(() => {
          setAutoPlayCount(autoPlayCount + 1);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 3000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [autoPlay, autoPlayCount, photos, loading]);

  const handleThumbnailClick = (actualIndex) => {
    setCurrentIndex(actualIndex);
  };

  const enterFullscreen = () => {
    const element = document.getElementById("photo-showcase");
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Safari
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen(); // IE/Edge
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  let thumbnails = [];
  if (photos.length <= 7) {
    thumbnails = photos;
  } else {
    const start = Math.max(0, currentIndex - 3);
    const end = Math.min(start + 7, photos.length);

    if (end - start < 7 && start > 0) {
      thumbnails = photos.slice(Math.max(0, end - 7), end);
    } else {
      thumbnails = photos.slice(start, end);
    }
  }
  return (
    <div className=" papaDiv" style={{ borderRadius: "5px " }}>
      {" "}
      <h5 className="text-start">
        <RiGalleryFill /> Photo Gallery
      </h5>
      <div
        className=""
        id="photo-showcase "
        style={{
          height: "280px",
          backgroundImage: `url(${photos[currentIndex]?.Photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "5px ",
        }}
      >
        <div
          className="photo-showcase-container "
          style={{
            background: "rgba(0,0,0,0.5)",
            height: "100%",
            borderRadius: "5px ",
          }}
        >
          <div className="d-flex justify-content-center ">
            <h5 style={{ color: "white" }}>
              Celebrating 100 Years Of Railway Electrification
            </h5>
          </div>

          <div className="slider-container text-center">
            <button
              className="btn btn-outline-light m-2"
              onClick={handlePrev}
              disabled={photos.length === 0}
            >
              <GrFormPrevious />
            </button>

            <div
              onClick={handleClick}
              className="main-image-container p-2 position-relative"
              style={{
                background: "rgba(0,0,0,0.2)",
                height: "220px",
                cursor: "pointer",
              }}
            >
              {photos.length > 0 && photos[currentIndex] ? (
                <>
                  <div className="position-absolute top-0 start-0">
                    <h6
                      className={`m-2 transition-text ${
                        hide ? "hidden" : "visible"
                      }`}
                      style={{ color: "white" }}
                    >
                      {photos[currentIndex]?.Name
                        ? photos[currentIndex]?.Name
                        : "No name"}
                    </h6>
                  </div>
                  <div className="position-absolute bottom-0 start-0">
                    <h6
                      className={`m-2 transition-text ${
                        hide ? "hidden" : "visible"
                      }`}
                      style={{ color: "white" }}
                    >
                      {photos[currentIndex]?.Date}:{" "}
                      {photos[currentIndex]?.Descriptions
                        ? photos[currentIndex]?.Descriptions
                        : "No Descriptions"}
                    </h6>
                  </div>
                  <img
                    src={photos[currentIndex]?.Photo}
                    alt={photos[currentIndex]?.name || "Image"}
                    className="main-image"
                  />
                </>
              ) : loading ? (
                <Loading />
              ) : (
                <p
                  onClick={() => {
                    setReload(!reload);
                  }}
                >
                  SometHing went wrong Click here to Reload
                </p>
              )}
            </div>

            <button
              className="btn btn-outline-light m-2"
              onClick={handleNext}
              disabled={photos.length === 0}
            >
              <GrNext />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoShowCaseForHome;
