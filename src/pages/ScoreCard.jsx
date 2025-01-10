import React, { useEffect } from "react";
import { useTestContext } from "../Context/TestContext";
import { useNavigate } from "react-router-dom";
import AnswerSheet from "../components/AnswerSheet";
import UserScoreCard from "../components/UserScoreCard";
import { IoMdArrowDropright } from "react-icons/io";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { useGlobalContext } from "../Context/GlobalContextOne";
import GoBackCom from "../components/GoBackCom";
const ScoreCard = ({ from, userResponse2 }) => {
  const { setActivePage } = useGlobalContext();
  useEffect(() => {
    setActivePage("score");
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate("/TestSeries/Select-Topics", { replace: true });
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  const handleNewTest = () => {
    navigate("/TestSeries");
  };

  return (
    <div className="container text-start mt-12" style={{ minHeight: "90vh" }}>
      <meta
        name="title"
        content="MCQ Town | Free Multiple Choice Questions for Exam Preparation"
      />
      <meta
        name="description"
        content="MCQ Town offers a wide selection of free multiple-choice questions (MCQs) for students, educators, and competitive exam aspirants. Prepare for exams with practice quizzes in subjects like Math, Science, General Knowledge, and more."
      />
      <meta
        name="keywords"
        content="MCQ, free multiple choice questions, online quizzes, exam preparation, competitive exams, school quizzes, general knowledge, math MCQ, science MCQ"
      />
      <meta name="robots" content="index, follow"></meta>
      <GoBackCom
        page={
          from === "GetAnsSheet"
            ? "Answer Sheet as par your last attempt"
            : "Score card"
        }
        link={"/TestSeries"}
      />
      <hr />
      <br />
      <UserScoreCard from={"GetAnsSheet"} userResponse2={userResponse2} />
      {from === "GetAnsSheet" ? (
        <AnswerSheet userResponse={userResponse2} />
      ) : null}
      <hr />
      <h6>
        Great job on your last test! Improve & keep the streak going with
        another round.
      </h6>
      <div class="d-flex flex-row  align-items-center mb-3">
        <div class="p-2">
          <IoArrowBackCircleOutline
            className="backBtn "
            style={{
              borderRadius: "100%",
              border: "0px",
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={handleNewTest}
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
      </div>
    </div>
  );
};

export default ScoreCard;
