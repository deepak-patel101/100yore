import React, { useEffect, useState } from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { BiSolidVideos } from "react-icons/bi";

import Study from "../../img/Study.png";
import Idea from "../../img/idea.png";
import Video from "../../img/trendingvideo.png";
import leaderBoard from "../../img/LeaderBoard.png";
import { FaClipboardQuestion } from "react-icons/fa6";
import { MdLeaderboard } from "react-icons/md";
import { HiChatBubbleLeftRight } from "react-icons/hi2";

const Cards = ({ title, TextData }) => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState();

  useEffect(() => {
    switch (title) {
      case "Video":
        setBackgroundImage(Video);
        break;
      case "Quizzes":
        setBackgroundImage(Study);
        break;
      case "GALLERY":
        setBackgroundImage(Idea);
        break;
      case "LEADERS BOARD":
        setBackgroundImage(leaderBoard);
        break;
      default:
        break;
    }
  }, [title]);

  const handleClick = () => {
    switch (title) {
      case "Video":
        navigate("/Trending/Videos");
        break;
      case "Quizzes":
        navigate("/TestSeries");
        break;
      case "GALLERY":
        navigate("/Gallery");
        break;
      case "LEADERS BOARD":
        navigate("/leadersBoard");
        break;
      default:
        break;
    }
  };

  return (
    <div className="center">
      <div
        className="property-card Subject"
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      >
        <a className="" href="#">
          <div
            className="property-image "
            onClick={handleClick}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: `linear-gradient(to bottom, white,${
                title === "Video" ? "#B7EDB5" : null
              })`,
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
                {title === "Video" ? (
                  <BiSolidVideos />
                ) : title === "Quizzes" ? (
                  <FaClipboardQuestion />
                ) : title === "GALLERY" ? (
                  <HiChatBubbleLeftRight />
                ) : (
                  <MdLeaderboard />
                )}
              </div>
              <a
                className=""
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
          <p style={{ fontSize: "15px" }}>{TextData}</p>
          <div style={{ fontSize: "25px" }}>
            {title === "Video" && <BiSolidVideos />}
            {title === "Quizzes" && <FaClipboardQuestion />}
            {title === "GALLERY" && <HiChatBubbleLeftRight />}
            {title === "LEADERS BOARD" && <MdLeaderboard />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
