import React from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const GoBackCom = ({ page, link }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(link);
  };
  return (
    <div className="mt-3 ">
      <div className="d-flex justify-content-between">
        <div class=" ">
          <IoArrowBackCircleOutline
            className="backBtn "
            style={{
              borderRadius: "100%",
              border: "0px",
              fontSize: "25px",
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
        <div className="">
          <h5>{page}</h5>
        </div>
        <div></div>
      </div>
      <hr />
    </div>
  );
};
export default GoBackCom;
