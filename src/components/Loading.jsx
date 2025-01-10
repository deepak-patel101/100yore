import React from "react";
const Loading = () => {
  return (
    <div className="d-flex justify-content-center mt-1">
      <div
        style={{ width: "200px" }}
        className="row progress d-flex justify-content-center"
        role="progressbar"
        aria-label="Animated striped example"
        aria-valuenow="100%"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          style={{ width: "100%" }}
        ></div>
      </div>
    </div>
  );
};
export default Loading;
