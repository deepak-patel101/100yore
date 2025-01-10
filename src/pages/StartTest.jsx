import React, { useState, useEffect } from "react";
import { useTestContext } from "../Context/TestContext";
import TestControls from "../components/TestControls";
import QuestionPaper from "../components/QuestionPaper";
import { useGlobalContext } from "../Context/GlobalContextOne";
import QuestionPaperForAdmin from "../components/QuestionPaperForAmin";
import { useUserContext } from "../Context/UserContext";
import { FaLanguage } from "react-icons/fa";
import GoogleTranslate from "../components/GoogleTranslate";

const StartTest = () => {
  const { setActivePage } = useGlobalContext();
  const { user } = useUserContext();

  useEffect(() => {
    setActivePage("starttest");
  }, []);

  const [startTest, setStartTest] = useState(false);
  const { start_Test, userResponse } = useTestContext();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const enterFullscreen = () => {
    const element = document.getElementById("fullScreen");
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  };

  // const disableEsc = (event) => {
  //   if (event.key === "Escape") {
  //     event.preventDefault();
  //   }
  // };

  // useEffect(() => {
  //   enterFullscreen();
  //   window.addEventListener("keydown", disableEsc);
  //   return () => {
  //     window.removeEventListener("keydown", disableEsc);
  //   };
  // }, []);

  return (
    <div
      id="fullScreen"
      className=" d-flex align-items-center  justify-content-center  text-center mt-12"
      style={{ minHeight: "90vh", background: "white" }}
    >
      <div>
        {!startTest ? (
          <div
            style={{
              margin: "0",
              position: "fixed",
              top: "0",
              left: "0",
              height: "100vh",
              width: "100vw",
              zIndex: "1",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
              borderRadius: "15px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                background: "white",
                borderRadius: "15px",
              }}
              className="position-relative "
              onClick={() => setStartTest(true)} // Stop click event propagation
            >
              <div className="m-3">
                <b>Get ready for the Test...</b>
                <br />
                <b>
                  negative marking of -1/3 <br />
                  for each wrong attempt{" "}
                </b>
                <br />
                <b>Best of luck.</b>
              </div>

              <button
                style={{ boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)" }}
                className="btn btn-outline-success m-3"
              >
                start the test
              </button>
            </div>
          </div>
        ) : (
          <div className="row ">
            <div className="col-12 col-md-4 ">
              <TestControls />
            </div>
            <div className="col-12 col-md-8 d-flex">
              {user.login_type === "admin" ? (
                <QuestionPaperForAdmin />
              ) : (
                <QuestionPaper />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartTest;
