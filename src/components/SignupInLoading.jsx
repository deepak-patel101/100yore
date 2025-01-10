import React from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import Loading from "./Loading";
const SignupInLoading = ({ msg }) => {
  return (
    <div
      style={{
        margin: "0",
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        width: "100vw",
        zIndex: 3,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="position-relative p-2"
        style={{
          boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
          background: "white",
          borderRadius: "15px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
          style={{
            height: "20px",
            width: "20px",
            cursor: "pointer",
            background: "white",
            borderRadius: "50%",
            zIndex: "100",
          }}
        ></div>
        <div className="m-3">
          {" "}
          {msg}...
          <Loading />{" "}
        </div>
      </div>
    </div>
  );
};
export default SignupInLoading;
