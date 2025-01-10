import React, { useEffect } from "react";

import trd1 from "../img/trd1.jpg";
import trd3 from "../img/trd3.jpg";
import trd2 from "../img/trd2.png";
import { FaPlay } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/imageSlider.css";
import BackGroundVideo from "../BackGroundVideo";

const Slider = () => {
  useEffect(() => {
    const carouselElement = document.querySelector(
      "#carouselExampleIndicators"
    );

    if (window.bootstrap && window.bootstrap.Carousel) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 3000,
        ride: "carousel",
      });

      return () => {
        carousel.dispose();
      };
    } else {
      console.error("Bootstrap Carousel is not available.");
    }
  }, []);

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <ol className="carousel-indicators">
        <li
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
        ></li>
        <li
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
        ></li>
        <li
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
        ></li>
      </ol>
      <div
        className="carousel-inner"
        style={{
          borderRadius: "10px",
          boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)",
        }}
      >
        <div className="carousel-item active">
          <div
            className="row"
            style={{
              background: "linear-gradient(to bottom, white,#bfdaf5)",
              borderRadius: "15px",
            }}
          >
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
              <img
                src={trd1}
                alt="home"
                style={{
                  maxHeight: "240px",
                  minHeight: "120px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div
              className="mt-3 col-12 col-md-6 d-flex justify-content-center align-items-center text-center"
              style={{ minHeight: "150px" }}
            >
              <div>
                <h4> 100 years of railway electrification</h4>
                <h6>
                  "From Steam to Sparks: A Century of Progress in Railway
                  Electrification!"
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div
            className="row"
            style={{
              background: "linear-gradient(to bottom, white,#f9ce68)",
              borderRadius: "15px",
            }}
          >
            <div
              className=" mt-3 col-12 col-md-6 d-flex justify-content-center align-items-center text-center"
              style={{ minHeight: "150px" }}
            >
              <div>
                <h4> 100 years of railway electrification</h4>
                <h6>
                  "100 Years of Power on Tracks – Electrifying India’s Journey!"
                </h6>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
              <img
                src={trd2}
                alt="study"
                style={{
                  maxHeight: "240px",
                  minHeight: "120px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div
            className="row"
            style={{
              background: "linear-gradient(to bottom, white,#93a326)",
              borderRadius: "15px",
            }}
          >
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
              <img
                src={trd3}
                alt="idea"
                style={{
                  maxHeight: "240px",
                  minHeight: "120px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div
              className="mt-3 col-12 col-md-6 d-flex justify-content-center align-items-center text-center"
              style={{ minHeight: "150px" }}
            >
              <div>
                <h4> 100 years of railway electrification</h4>
                <h6>
                  "Electrifying the Nation for 100 Years – A Century of Railway
                  Excellence!"
                </h6>
              </div>
            </div>
          </div>
        </div>
        <a
          className="text-end"
          style={{
            color: "white",
            position: "absolute",
            bottom: "0",
            left: "0",
            opacity: "0.3",
            margin: "10px",
            zIndex: "2",
          }}
          href="https://storyset.com/work"
        >
          art{" "}
        </a>
      </div>
      <a
        className="carousel-control-prev"
        href="#carouselExampleIndicators"
        role="button"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#carouselExampleIndicators"
        role="button"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
      <div></div>
    </div>
  );
};

export default Slider;
