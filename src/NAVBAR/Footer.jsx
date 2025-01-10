import { Link } from "react-router-dom";
import React, { useState } from "react";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { LuFacebook } from "react-icons/lu";
import { FaSquareTwitter } from "react-icons/fa6";
import { CiTwitter } from "react-icons/ci";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaNoteSticky } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { MdLocalFireDepartment } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { PiExam } from "react-icons/pi";
import { PiExamFill } from "react-icons/pi";

const Footer = () => {
  const [insta, setInsta] = useState(true);
  const [facebook, setFacebook] = useState(true);
  const [twitter, setTwitter] = useState(true);
  const [call, setCall] = useState(true);
  const [mail, setMail] = useState(true);
  const [home, setHome] = useState(true);
  const [test, setTest] = useState(true);
  const [trend, setTrend] = useState(true);
  const [noti, setNoti] = useState(true);
  const [idea, setIdea] = useState(true);
  const handleHover = (type) => {
    if (type === "fb") {
      setFacebook(!facebook);
    }
    if (type === "insta") {
      setInsta(!insta);
    }
    if (type === "twitter") {
      setTwitter(!twitter);
    }
    if (type === "mail") {
      setMail(!mail);
    }
    if (type === "call") {
      setCall(!call);
    }
    if (type === "home") {
      setHome(!home);
    }
    if (type === "test") {
      setTest(!test);
    }
    if (type === "trend") {
      setTrend(!trend);
    }
    if (type === "noti") {
      setNoti(!noti);
    }
    if (type === "idea") {
      setIdea(!idea);
    }
  };
  return (
    <div
      style={{
        background: "rgb(240, 240, 240)",
        width: "100%",
        marginTop: "25px",
        paddingTop: "25px",
        paddingBottom: "10px",
      }}
    >
      <div className="container text-center  " style={{ zIndex: "9999" }}>
        <div className="row">
          <div className="col-md-4">
            <h4>Sections</h4>
            <ul className="list-unstyled">
              <li
                className=""
                onMouseEnter={() => handleHover("home")}
                onMouseLeave={() => handleHover("home")}
              >
                {home ? <IoHomeOutline /> : <IoHomeSharp />}
                <Link className="nav-link d-inline" to="/">
                  Home
                </Link>
              </li>

              <li
                onMouseEnter={() => handleHover("trend")}
                onMouseLeave={() => handleHover("trend")}
              >
                {trend ? (
                  <MdOutlineLocalFireDepartment />
                ) : (
                  <MdLocalFireDepartment />
                )}
                <Link className="nav-link d-inline" to="/Gallery">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Contact Us</h4>
            <ul className="list-unstyled">
              <li
                className="rotate-icon"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => handleHover("call")}
                onMouseLeave={() => handleHover("call")}
              >
                {call ? <IoCallOutline /> : <IoCall />} 778***9575
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Follow us on</h4>
            <ul className="list-unstyled">
              <li
                style={{ cursor: "pointer" }}
                onMouseEnter={() => handleHover("insta")}
                onMouseLeave={() => handleHover("insta")}
              >
                {insta ? <IoLogoInstagram /> : <FaSquareInstagram />} Instagram
              </li>
              <li
                style={{ cursor: "pointer" }}
                onMouseEnter={() => handleHover("fb")}
                onMouseLeave={() => handleHover("fb")}
              >
                {facebook ? <LuFacebook /> : <FaFacebookSquare />} Facebook
              </li>{" "}
              <li
                style={{ cursor: "pointer" }}
                onMouseEnter={() => handleHover("twitter")}
                onMouseLeave={() => handleHover("twitter")}
              >
                {twitter ? <CiTwitter /> : <FaSquareTwitter />} twitter
              </li>
            </ul>
            {/* Add content for the second column here */}
          </div>
        </div>
        <hr />
        <div className="text-center ">
          <p>&copy; {new Date().getFullYear()} 100YoRE</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
