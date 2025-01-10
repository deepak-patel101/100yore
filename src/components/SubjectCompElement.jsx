import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CircularProgressBar from "./CircularProgressBar";
import { useUserContext } from "../Context/UserContext";
import { MdDomainVerification } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { RiQuestionnaireFill } from "react-icons/ri";

const SubjectCompElement = ({ selected }) => {
  const { user } = useUserContext();
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [totalVariQuestion, setTotalVariQuestion] = useState(0);
  const [totalReferQuestion, setTotalReferQuestion] = useState(0);
  const [totalAttQuestion, setTotalAttQuestion] = useState(0);
  const [totalCorQuestion, setTotalCorQuestion] = useState(0);
  const [totalCorQueNo, setTotalCorQuesNo] = useState(0);
  const [totalAttQueNo, setTotalAttQueNo] = useState(0);
  const [totalWroQuestion, setTotalWroQuestion] = useState(0);
  useEffect(() => {
    if (selected !== undefined) {
      let q = 0;
      let r = 0;
      let v = 0;
      let a = 0;
      let c = 0;

      Object.entries(selected?.subjects)?.forEach(([key, value]) => {
        // Check and process 'totals'
        if (value?.totals) {
          q += Number(value.totals?.unique_questions ?? 0);
          r += Number(value.totals?.total_references ?? 0);
          v += Number(value.totals?.total_verified ?? 0);
        }

        // Check and process 'user_record'
        if (value?.user_record) {
          a += Number(value.user_record?.total_attempted ?? 0);
          c += Number(value.user_record?.total_correct ?? 0);
        }
      });

      // Update state variables after the loop
      setTotalQuestion(q);
      setTotalReferQuestion(r);
      setTotalVariQuestion(v);
      setTotalCorQuesNo(c);
      setTotalAttQueNo(a);

      // Calculate percentages safely
      setTotalCorQuestion(a > 0 ? (c / a) * 100 : 0);
      setTotalAttQuestion(q > 0 ? (a / q) * 100 : 0);
      setTotalWroQuestion(a > 0 ? ((a - c) / a) * 100 : 0);
    } else {
      // Reset all state variables when selected is undefined
      setTotalQuestion(0);
      setTotalReferQuestion(0);
      setTotalVariQuestion(0);
      setTotalCorQuesNo(0);
      setTotalAttQueNo(0);
      setTotalCorQuestion(0);
      setTotalAttQuestion(0);
      setTotalWroQuestion(0);
    }
  }, [selected]);

  return (
    <div>
      {" "}
      <div className="papaDiv mt-2">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start ">
            <div>
              {" "}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-dashboard">
                    {totalQuestion} Total Que.
                  </Tooltip>
                }
              >
                <div
                  className="d-flex align-item-center"
                  style={{ fontSize: "15px" }}
                >
                  {totalQuestion}
                  <RiQuestionnaireFill />
                  &nbsp;&nbsp;
                </div>
              </OverlayTrigger>
            </div>{" "}
            {user?.login_type === "admin" ? (
              <div>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      {totalVariQuestion} Total Verified Questions.
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    {totalVariQuestion}
                    <MdDomainVerification />
                    &nbsp;&nbsp;
                  </div>
                </OverlayTrigger>{" "}
              </div>
            ) : null}
            {user?.login_type === "admin" ? (
              <div>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      {totalReferQuestion}
                      Questions have References.
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    {totalReferQuestion}
                    <FaCopy />
                  </div>
                </OverlayTrigger>
              </div>
            ) : null}
          </div>
          <div>
            {" "}
            Your Test Record
            <div className="d-flex justify-content-between ">
              <div className="m-2">
                {/* Attempted-//////////////////////////////// */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      You Attempted
                      {totalAttQueNo}
                      Question, out of {totalQuestion}
                      Questions .
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    <CircularProgressBar
                      data={totalAttQuestion}
                      size="50px"
                      primary="#0378cf"
                      secondary="#e1f0ff"
                    />
                  </div>
                </OverlayTrigger>
                {totalAttQueNo}
              </div>
              <div className="m-2">
                {/* correct - ///////////////////////////////////////////////// */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      You marked
                      {totalCorQueNo}
                      Correct out of
                      {totalAttQueNo} Attempted Questions
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    <CircularProgressBar
                      data={totalCorQuestion}
                      size="50px"
                      primary="#0fcf03"
                      secondary="#e8ffe1"
                    />
                  </div>
                </OverlayTrigger>
                {totalCorQueNo}
              </div>
              <div className="m-2">
                {/* Incorrect - //////////////////////////// */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-dashboard">
                      You marked
                      {totalAttQueNo - totalCorQueNo}
                      Wrong out of {totalAttQueNo}
                      Attempted Questions
                    </Tooltip>
                  }
                >
                  <div
                    className="d-flex align-item-center"
                    style={{ fontSize: "15px" }}
                  >
                    <CircularProgressBar
                      data={totalWroQuestion}
                      // size={"50px"}
                      primary="#ff6347"
                      secondary="#ffe4e1"
                    />
                  </div>
                </OverlayTrigger>
                {totalAttQueNo - totalCorQueNo}
              </div>
            </div>
          </div>
          <div
            className="d-flex flex-column mb-3"
            style={{ position: "relative" }}
          >
            {" "}
            wishing for the best
            {/* <button
              className="btn btn-sm btn-outline-primary"
              onClick={toggleDropdown}
              style={{ width: "fit-content" }}
            >
              Color Code
            </button> */}
            {/* {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0",
                  zIndex: "10",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                  borderRadius: "4px",
                  width: "200px", // Adjust width as needed
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <div
                    style={{
                      borderRadius: "2px",
                      height: "12px",
                      width: "18px",
                      border: "1px solid red",
                      marginRight: "8px",
                    }}
                  ></div>
                  <div>&lt; 33% Verified Q</div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div
                    style={{
                      borderRadius: "2px",
                      height: "12px",
                      width: "18px",
                      border: "1px solid blue",
                      marginRight: "8px",
                    }}
                  ></div>
                  <div>&lt; 66% Verified Q</div>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      borderRadius: "2px",
                      height: "12px",
                      width: "18px",
                      border: "1px solid green",
                      marginRight: "8px",
                    }}
                  ></div>
                  <div>&gt; 66% Verified Q</div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubjectCompElement;
