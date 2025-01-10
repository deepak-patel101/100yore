import React, { useEffect, useState } from "react";
import "../Trendings/Card.css";
// import "./grid.css";
import { useUserContext } from "../../Context/UserContext";
import Study from "../../img/Study.png";
import Idea from "../../img/idea.png";
import Video from "../../img/trendingvideo.png";
import leaderBoard from "../../img/LeaderBoard.png";
import { FaClipboardQuestion } from "react-icons/fa6";
import { MdLeaderboard } from "react-icons/md";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { BiSolidVideos } from "react-icons/bi";

const DashboardHome = ({ setActBtn }) => {
  const { user } = useUserContext();
  const titles =
    user.login_type === "partner"
      ? ["CUSTOM SETS", "UPDATE PROFILE", "ADD VIDEOS", "YOUR CUSTOM SETS"]
      : [
          "CUSTOM SETS",
          "UPDATE PROFILE",
          "BECOME YOUTUBE PARTNER",
          "YOUR CUSTOM SETS",
        ];

  const getBackgroundImage = (title) => {
    switch (title) {
      case "CUSTOM SETS":
        return Video;
      case "UPDATE PROFILE":
        return Study;
      case "ADD VIDEOS":
        return Idea;
      case "BECOME YOUTUBE PARTNER":
        return leaderBoard;
      case "YOUR CUSTOM SETS":
        return Study;
      default:
        return null;
    }
  };

  const getIcon = (title) => {
    switch (title) {
      case "CUSTOM SETS":
        return <BiSolidVideos />;
      case "YOUR CUSTOM SETS":
        return <BiSolidVideos />;
      case "UPDATE PROFILE":
        return <FaClipboardQuestion />;
      case "ADD VIDEOS":
        return <HiChatBubbleLeftRight />;
      case "BECOME YOUTUBE PARTNER":
        return <MdLeaderboard />;
      default:
        return null;
    }
  };

  return (
    <div className="row justify-content-center mt-3">
      {titles.map((title) => (
        <div
          className="d-flex justify-content-center align-items-center col-lg-4 col-md-4 col-12 mb-4"
          key={title}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="property-card Subject"
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          >
            <a href="#">
              <div
                className="property-image"
                onClick={() => setActBtn(title)}
                style={{
                  backgroundImage: `url(${getBackgroundImage(title)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="property-image-title">
                  <h4
                    style={{
                      paddingBottom: "6px",
                      border: "2px solid black",
                      background: "rgba(255, 255, 255 ,0.3)",
                    }}
                  >
                    {title}
                  </h4>
                  <div style={{ fontSize: "25px", color: "black" }}>
                    {getIcon(title)}
                  </div>
                  <a
                    style={{ color: "black", fontSize: "8px" }}
                    href="https://www.freepik.com/free-vector/hand-drawn-flat-design-mba-illustration-illustration_23991388.htm#fromView=search&page=1&position=19&uuid=d867d615-5ab3-4f38-88e9-63f2aab4a6e0"
                  >
                    Image by freepik
                  </a>
                </div>
              </div>
            </a>
            <div className="property-description">
              <h5>{title}</h5>
              <p style={{ fontSize: "15px" }}></p>
              <div style={{ fontSize: "25px" }}>{getIcon(title)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHome;
