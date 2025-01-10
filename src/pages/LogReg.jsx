import React from "react";
import { useEffect, useState } from "react";
import Login from "../components/LogIn";
import "../components/css/SignInUp.css";
import Registration from "../components/registration";

import { useGlobalContext } from "../Context/GlobalContextOne";
import { Helmet } from "react-helmet-async";
const LogReg = () => {
  const { setActivePage } = useGlobalContext();
  useEffect(() => {}, []);
  const [isSignInActive, setIsSignInActive] = useState(true);

  const handleToggleIn = () => {
    if (!isSignInActive) {
      setIsSignInActive(true);
    }
  };
  const handleToggleUp = () => {
    if (isSignInActive) {
      setIsSignInActive(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div>
      <Helmet>
        <title>
          Login | 100 years of railway electrification - Access Your Account
        </title>
        <meta
          name="description"
          content="Log in to your MCQ Town account to access your personalized test series, track your progress, and continue your exam preparation journey. New user? Register now!"
        />
        <link rel="canonical" href="https://mcqtown.com/Log&Reg" />
        <meta
          name="title"
          content="Login | MCQ Town - Access Your Account for Exam Prep"
        />
        <meta name="robots" content="noindex, follow" />

        {/* Open Graph tags for social media */}
        <meta property="og:title" content="Login | MCQ Town" />
        <meta
          property="og:description"
          content="Log in to your MCQ Town account to access your test series, track progress, and continue preparing for exams."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcqtown.com/login" />
        <meta
          property="og:image"
          content="https://mcqtown.com/images/login-thumbnail.jpg"
        />

        {/* Twitter card for Twitter sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login | MCQ Town" />
        <meta
          name="twitter:description"
          content="Log in to your MCQ Town account to access personalized test series and track your exam prep progress."
        />
        <meta
          name="twitter:image"
          content="https://mcqtown.com/images/login-thumbnail.jpg"
        />
      </Helmet>

      <div
        style={{}}
        className="container-fluid d-flex justify-content-center align-items-center mt-3"
        // style={{ minHeight: "90vh" }}
      >
        <div
          className="content-wrapper"
          style={{
            boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)", // Shadow on bottom-right
            padding: "15px",
            marginBottom: "15px", // Adding some margin at the bottom for spacing
            borderRadius: "5px", // Adding border radius for rounded corners ,
            width: "80vw",
            height: "75vh",
          }}
        >
          <div className="d-flex h-100 ">
            <div
              onClick={handleToggleIn}
              className={`sign-in position-relative ${
                isSignInActive ? "active" : ""
              }`}
              style={{
                background: "linear-gradient(to bottom, #5be0bb,#04543c",
                borderRadius: "5px 0 0 5px",
              }}
            >
              <div
                className=""
                style={{
                  width: "70%",
                  height: "auto",
                  boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)", // Shadow on bottom-right
                  padding: "15px",
                  marginBottom: "15px", // Adding some margin at the bottom for spacing
                  borderRadius: "5px", // Adding border radius for rounded corners
                  backgroundColor: "#ffffff", // Adding background color to the div
                }}
                onClick={(e) => (isSignInActive ? e.stopPropagation() : null)}
              >
                <h4
                  style={{ color: "white" }}
                  className="position-absolute top-0 start-0 p-1"
                >
                  Sign In
                </h4>
                <Login />
              </div>
            </div>
            <div
              className={`sign-up position-relative ${
                isSignInActive ? "" : "active"
              }`}
              style={{
                background: "linear-gradient(to bottom, #0A96BA,#063970",
                borderRadius: " 0 5px  5px 0",
              }}
              onClick={handleToggleUp}
            >
              <div
                className=""
                style={{
                  width: "70%",
                  height: "auto",

                  boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)", // Shadow on bottom-right
                  padding: "15px",
                  marginBottom: "15px", // Adding some margin at the bottom for spacing
                  borderRadius: "5px", // Adding border radius for rounded corners
                  backgroundColor: "#ffffff", // Adding background color to the div
                }}
                onClick={(e) => (!isSignInActive ? e.stopPropagation() : null)}
              >
                {" "}
                <h4
                  style={{ color: "white" }}
                  className="position-absolute top-0 start-0 p-1"
                >
                  Sign Up
                </h4>
                {/* <Registration /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="toggleButton">
        <button
          className="btn btn-primary toggleButton"
          onClick={() => setIsSignInActive(!isSignInActive)}
        >
          {isSignInActive ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
};
export default LogReg;
