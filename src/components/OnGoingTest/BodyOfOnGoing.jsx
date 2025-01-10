import React, { useState } from "react";
import SelectTestToDo from "../SelectTestToDo";
import SelectOnGoingTest from "./SelectOnGoingTest";
// import "../css/testType.css";

const BodyOfOnGoing = () => {
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
        {/* {hover ? (
        //   <SelectOnGoingTest testType={"easy"} bgColor={"#B7EDB5"} />
        ) : null} */}
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
export default BodyOfOnGoing;
