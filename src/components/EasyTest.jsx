import React, { useState } from "react";
import "./css/testType.css";
import SelectTestToDo from "./SelectTestToDo";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FaAngleDoubleUp } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import TodaysTest from "./TodaysTest";

const EasyTest = ({ from, cs_data }) => {
  const [hover, setHover] = useState(true);
  //   const [click, setClick] = useState(false);

  const handleClick = (event) => {
    // Prevent event from bubbling up
    event.stopPropagation();
    setHover(!hover);
  };
  const handleMainDivHover = () => {
    if (hover === false) {
      setHover(true);
    }
  };

  return (
    <div
      onMouseEnter={handleMainDivHover}
      //   onMouseLeave={() => setHover(false)}
      className="position-relative "
    >
      {/* <div
        className="d-flex justify-content-between"
        onClick={() => setHover(!hover)}
        style={{ cursor: "pointer" }}
      >
        <h5 className="text-start" style={{ cursor: "pointer" }}>
          <FaRegNoteSticky />{" "}
        {from === "customSets" ? "My Custom sets" : "Easy"} 
         </h5>
        <div onClick={handleClick}>
          {!hover ? <FaAngleDoubleDown /> : <FaAngleDoubleUp />}
        </div>
      </div>  <hr />*/}
      <div className={`content-for-test-type ${hover ? "show" : "hide"}`}>
        {hover ? (
          <SelectTestToDo
            testType={`${from === "customSets" ? "customSets" : "easy"}`}
            bgColor={"#B7EDB5"}
            from={from}
            cs_data={cs_data}
          />
        ) : null}
      </div>{" "}
      <div
        className={`content-for-test-type ${!hover ? "show" : "hide"}`}
        onClick={() => setHover(!hover)}
        style={{ cursor: "pointer" }}
      >
        set of test with difficulty level easy
      </div>
    </div>
  );
};

export default EasyTest;
