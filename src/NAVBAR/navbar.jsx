import React, { useState } from "react";
import { FaLanguage } from "react-icons/fa6";
import { Link } from "react-router-dom";
import GoogleTranslate from "../components/GoogleTranslate";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { MdDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import SignupInLoading from "../components/SignupInLoading";
import { useGlobalContext } from "../Context/GlobalContextOne";

const Navbar = () => {
  const { user, updateUserData } = useUserContext();
  const { setSearchKeyWords } = useGlobalContext();
  const [showProfile, setShowProfile] = useState(false);
  const [keyWords, setKeyWords] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState(false);
  const handleLogOut = async () => {
    const token = localStorage.getItem("sessionToken"); // Retrieve the token from localStorage
    setMessage(true);
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/sign_Out_User.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const result = await response.json();

      if (result.success) {
        localStorage.removeItem("sessionToken"); // Remove the token from localStorage
        setMessage(false);
      } else {
        setMessage(result.message || "Failed to logout");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(false);
    }
    const logoutUser = async () => {
      try {
        await fetch(
          "https://railwaymcq.com/railwaymcq/RailPariksha/userLogout.php"
        ); // Update URL as necessary
        updateUserData(null);
        // navigate("/Log&Reg");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
    logoutUser();

    navigate("/");
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  const handleMyAccount = () => {
    setShowProfile(false);
    navigate("/Dashboard");
  };
  const handelSearchChange = (e) => {
    const data = e.target.value;
    setKeyWords(data);
    setAlertMsg(false);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyWords !== "") {
      setSearchKeyWords(keyWords);
      navigate("/Home/Search-Result");
    } else {
      setAlertMsg(true);
      setTimeout(() => {
        setAlertMsg(false);
      }, 3000);
    }
  };

  return (
    <div className="mb-2">
      {message && <SignupInLoading msg={"Signing Out."} />}
      <nav className="navbar navbar-expand-lg bg-body-tertiary Subject">
        <div className="container-fluid" style={{ fontSize: "15px" }}>
          <Link to="/" className="navbar-brand">
            <div className="d-flex justify-content-center align-item-center">
              <div className="row">
                <div className="row d-flex ">
                  <div className="col-md-2 d-flex justify-content-center align-items-center">
                    <img src={logo} alt="logo" style={{ height: "45px" }} />
                  </div>

                  <div className="col-md-10">
                    <h2> 100YoRE</h2>
                  </div>
                </div>
                <div className="row">
                  <div style={{ fontSize: "15px" }}>
                    {" "}
                    Celebrating <b>100</b> <b>Y</b>ears of <b>R</b>ailway{" "}
                    <b>E</b>lectrification
                  </div>
                </div>
              </div>
              &nbsp;
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto  mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="TestSeries">
                  Test Series
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="Videos">
                  Video
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="leadersBoard">
                  Leader`s Board
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="Gallery">
                  Gallery
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="Videos">
                  Videos
                </Link>
              </li> */}
              {user?.login_type === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="Admin">
                    Admin
                  </Link>
                </li>
              ) : null}
            </ul>

            <div className="d-flex">
              <FaLanguage
                className="mr-1"
                style={{
                  fontSize: "40px",
                  paddingRight: "5px",
                  color: "#129ADA",
                }}
              />
              <GoogleTranslate />
            </div>

            {/* <form className="d-flex" role="search">
              <div className="d-flex flex-column text-center">
                <div className="d-flex">
                  <input
                    className="form-control m-1"
                    type="search"
                    placeholder="Videos and MCQ Keywords"
                    aria-label="Search"
                    value={keyWords}
                    onChange={(e) => handelSearchChange(e)}
                    style={{ height: "40px" }}
                  />
                  <button
                    className="btn btn-outline-success m-1"
                    style={{ height: "40px" }}
                    type="submit"
                    onClick={(e) => handleSearch(e)}
                  >
                    Search
                  </button>{" "}
                </div>
                {alertMsg ? (
                  <div style={{ color: "red" }}> Nothing to Search</div>
                ) : null}
              </div>
            </form> */}

            {user ? (
              <div>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      {" "}
                      Well-come : {user?.name}
                    </Tooltip>
                  }
                >
                  <button
                    className="btn btn-outline-success m-1"
                    style={{ height: "40px" }}
                    onClick={handleMyAccount}
                  >
                    <MdDashboard />
                  </button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip-signout">Sign Out</Tooltip>}
                >
                  <button
                    className="btn btn-outline-danger m-1"
                    onClick={handleLogOut}
                    style={{ height: "40px" }}
                  >
                    <FaSignOutAlt />
                  </button>
                </OverlayTrigger>
              </div>
            ) : (
              <Link
                className="btn btn-success"
                to="Log&Reg"
                type="submit"
                style={{ height: "40px" }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
