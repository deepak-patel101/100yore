import React, { useEffect } from "react";
import TrendingCom from "../components/Trendings/TrndingComp";
import Objection from "../components/Feedback/Objection";
import { useGlobalContext } from "../Context/GlobalContextOne";
const FeedBack = () => {
  const { setActivePage } = useGlobalContext();
  useEffect(() => {
    setActivePage("Feedback");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <meta
        name="title"
        content="MCQ Town | Free Multiple Choice Questions for Exam Preparation"
      />
      <meta
        name="description"
        content="MCQ Town offers a wide selection of free multiple-choice questions (MCQs) for students, competitive exam aspirants."
      />
      <meta
        name="keywords"
        content="MCQ, free multiple choice questions, online quizzes, exam preparation, competitive exams,  general knowledge MCQ, science MCQ"
      />
      <meta name="robots" content="index, follow"></meta>
      <Objection />
    </div>
  );
};
export default FeedBack;
