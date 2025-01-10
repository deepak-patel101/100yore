import React, { useState } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import SelectTest from "./SelectTest";
import SelectTopics from "./SelectTopics";
const Topics = () => {
  const { subject, setSubject } = useGlobalContext();

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/TestSeries");
  };
  console.log(subject);
  return (
    <div className="container text-center mt-12">
      {" "}
      <IoArrowBackCircleOutline
        className="backBtn "
        style={{
          borderRadius: "100%",
          border: "0px",
          fontSize: "30px",
          cursor: "pointer",
        }}
        onClick={handleGoBack}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "black";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = ""; // Reset to default
          e.target.style.color = ""; // Reset to default
        }}
      />
      {subject?.selectedTopic ? (
        <div>
          <h2> selected topic : {subject.selectedTopic}</h2>
          <SelectTest />
        </div>
      ) : (
        <div>
          <SelectTopics />
        </div>
      )}{" "}
      <IoArrowBackCircleOutline
        className="backBtn "
        style={{
          borderRadius: "100%",
          border: "0px",
          fontSize: "30px",
          cursor: "pointer",
        }}
        onClick={handleGoBack}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "black";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = ""; // Reset to default
          e.target.style.color = ""; // Reset to default
        }}
      />
    </div>
  );
};
export default Topics;
