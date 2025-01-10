import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Loading";
import "./PhotoCase.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GrFormPrevious, GrNext } from "react-icons/gr";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import GoBackCom from "../GoBackCom";

const PhotoShowCase = ({ from }) => {
  const location = useLocation();
  const category = location.state?.category;
  const depot = location.state?.depot;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_Photo.php?category=${category}&depot_name=${depot}`
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
  }, [category]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  useEffect(() => {
    if (autoPlay) {
      const timeoutId = setTimeout(() => {
        setAutoPlayCount(autoPlayCount + 1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [autoPlay, autoPlayCount, photos]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (autoPlay) {
          setAutoPlay(false);
        }
        exitFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setAutoPlay(false); // Stop autoplay when exiting fullscreen
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [autoPlay]);

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
    <div style={{ minHeight: "90vh" }}>
      {" "}
      {autoPlay ? null : <GoBackCom page={category} link={"/Gallery"} />}
      <div
        id="photo-showcase"
        style={{
          height: "100vh",
          backgroundImage: `url(${photos[currentIndex]?.Photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="photo-showcase-container pt-2"
          style={{
            background: "rgba(0,0,0,0.5)",
            height: "100vh",
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
              className="main-image-container p-2 position-relative"
              style={{ background: "rgba(0,0,0,0.2)" }}
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
                <p>No photos available</p>
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
          <div className="d-flex justify-content-center mt-1">
            {!autoPlay ? (
              <div>
                <button
                  className="btn btn-outline-light"
                  onClick={() => {
                    setAutoPlay(true);
                    enterFullscreen();
                  }}
                >
                  <FaPlayCircle />
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-outline-light"
                  onClick={() => {
                    setAutoPlay(false);
                    exitFullscreen();
                  }}
                >
                  <FaStopCircle />
                </button>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center ">
            <h5 style={{ color: "white" }}>{category}</h5>
          </div>
          <div className="thumbnail-strip d-flex justify-content-center flex-wrap">
            {loading ? <Loading /> : null}

            {thumbnails.map((photo, index) => {
              const actualIndex = photos.indexOf(photo);
              return (
                <div key={index}>
                  <img
                    src={photo.Photo}
                    alt={photo.name}
                    className={`thumbnail img-thumbnail ${
                      currentIndex === actualIndex
                        ? "active-thumbnail activeImg Subject"
                        : ""
                    }`}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => handleThumbnailClick(actualIndex)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoShowCase;
