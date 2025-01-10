import React from "react";
import { BiSolidVideos } from "react-icons/bi";
import { GoChecklist } from "react-icons/go";
import { FcIdea } from "react-icons/fc";
import { PiRankingDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { BsFire } from "react-icons/bs";
import "./css/HomeTrending.css";

const HomeTrending = () => {
  const navigate = useNavigate();

  const handleClick = (type) => {
    if (type === "Videos") {
      navigate("/Trending/Videos");
    } else navigate("/Trending");
  };
  return (
    <div className="">
      <div
        className="row "
        style={{
          boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)", // Shadow on bottom-right
          padding: "15px",
          marginBottom: "15px", // Adding some margin at the bottom for spacing
          borderRadius: "5px", // Adding border radius for rounded corners
          backgroundColor: "#ffffff", // Adding background color to the div
        }}
      >
        <h5 className="text-start">
          {" "}
          <BsFire /> Trending
        </h5>
        <div
          className="col-12 col-md-3 trending dns padding d-flex justify-content-center align-items-center text-center"
          onClick={() => handleClick("Videos")}
        >
          {" "}
          <BiSolidVideos />
          Videos
        </div>
        <div
          onClick={() => handleClick("question")}
          className=" col-12 col-md-3 trending question padding d-flex justify-content-center align-items-center text-center"
        >
          {" "}
          <GoChecklist />
          Question
        </div>
        <div
          onClick={() => handleClick("my-idea")}
          className=" col-12 col-md-3 trending my-idea padding d-flex justify-content-center align-items-center text-center"
        >
          {" "}
          <FcIdea />
          Discussion
        </div>
        <div
          onClick={() => handleClick("leader-board")}
          className=" col-12 col-md-3 trending leader-board padding d-flex justify-content-center align-items-center text-center"
        >
          {" "}
          <PiRankingDuotone />
          Leader Board
        </div>
      </div>
    </div>
  );
};
export default HomeTrending;
