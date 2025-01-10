import React from "react";
import { useState } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FaAngleDoubleUp } from "react-icons/fa";
import SelectTestToDo from "./SelectTestToDo";
import { FaRegNoteSticky } from "react-icons/fa6";
const ToughTest = ({ from }) => {
  const [hover, setHover] = useState(false);
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
      <div
        className="d-flex justify-content-between"
        onClick={() => setHover(!hover)}
        style={{ cursor: "pointer" }}
      >
        <h5 className="text-start" style={{ cursor: "pointer" }}>
          <FaRegNoteSticky /> Tough
        </h5>
        <div onClick={handleClick}>
          {!hover ? <FaAngleDoubleDown /> : <FaAngleDoubleUp />}
        </div>
      </div>
      <hr />
      <div className={`content-for-test-type ${hover ? "show" : "hide"}`}>
        {hover ? (
          <div>
            <SelectTestToDo testType={"hard"} bgColor={"#EDB5B5"} from={from} />
          </div>
        ) : null}
      </div>{" "}
      <div
        className={`content-for-test-type ${!hover ? "show" : "hide"}`}
        onClick={() => setHover(!hover)}
        style={{ cursor: "pointer" }}
      >
        set of test with difficulty level easy to tough
      </div>
    </div>
  );
};
export default ToughTest;
