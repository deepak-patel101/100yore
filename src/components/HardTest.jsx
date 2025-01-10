import React from "react";
import { useState } from "react";
const HardTest = ({ from }) => {
  const [hover, setHover] = useState(false);
  //   const [click, setClick] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="position-relative "
    >
      <h5
        className="text-start"
        onClick={() => setHover(!hover)}
        style={{ cursor: "pointer" }}
      >
        {" "}
        Hard
      </h5>
      <div className={`content-for-test-type ${hover ? "show" : "hide"}`}>
        {hover ? (
          <div>
            text
            <br />
            text
            <br />
            text
          </div>
        ) : null}
      </div>{" "}
      <div className={`content-for-test-type ${!hover ? "show" : "hide"}`}>
        {hover ? null : " set of text with difficulty level easy"}
      </div>
    </div>
  );
};
export default HardTest;
