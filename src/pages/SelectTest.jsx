import React, { useEffect } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTestContext } from "../Context/TestContext";
import SelectTestType from "../components/SelectTestType";
import { BiError } from "react-icons/bi";

const SelectTest = ({ from }) => {
  const { setActivePage, subject } = useGlobalContext();
  useEffect(() => {
    setActivePage("TestSeries");
  }, []);
  const { test_loading, test_data, test_error } = useTestContext();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/TestSeries/Select-Topics");
  };
  useEffect(() => {
    if (from === "HOME") {
      return;
    }
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div
      className="container text-start mt-12"
      style={{ minHeight: from === "HOME" ? null : "90vh" }}
    >
      <div className="d-flex flex-row  align-items-center mb-3">
        {/* <div className="p-2">
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
        </div> */}
        <div className="p-2">
          <h6>Start a test for - {subject?.selectedTopic}</h6>
        </div>
        <br />
      </div>{" "}
      <div>{subject.queFrom ? "MCQ based on PDF and NOTES" : null}</div>
      <hr />
      {!test_loading &&
      test_data?.message ===
        "No MCQs found for the given topic code and subject code" ? (
        <h5 style={{ color: "red" }}>
          <BiError /> No MCQs found for the selected topic.{" "}
        </h5>
      ) : null}
      <SelectTestType from={from} />
      {/* <div className="p-2">
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
      </div> */}
    </div>
  );
};
export default SelectTest;
