import React, { useState, useEffect } from "react";
import { useTestContext } from "../Context/TestContext";
import { GrScorecard } from "react-icons/gr";
import { useUserContext } from "../Context/UserContext";
import { useGlobalContext } from "../Context/GlobalContextOne";
import Loading from "./Loading";

const UserScoreCard = ({ from, userResponse2 }) => {
  const { user } = useUserContext();
  const { subject } = useGlobalContext();
  const { start_Test, userResponse, countDown } = useTestContext();
  const [userTestAnsData, setUserTestAnsData] = useState(userResponse);
  const [score, setScore] = useState({ rightAns: 0, wrongAns: 0, skipped: 0 });
  const [setNo, setSetNo] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if ((from = "GetAnsSheet")) {
      setUserTestAnsData(userResponse2);
    } else {
      setUserTestAnsData(userResponse);
    }
  }, [from]);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!start_Test || !userTestAnsData) return;

    let rightCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    Object.entries(start_Test.test).forEach(([_, question]) => {
      const questionCode = question?.qcode;

      if (!questionCode) {
        skippedCount++; // Skip if questionCode is undefined
        return;
      }

      // Safely check if the answer exists in userTestAnsData
      const userAnswer = userTestAnsData?.testAnswer?.[questionCode]?.answer;

      if (userAnswer !== undefined) {
        if (userAnswer === question.answer) {
          rightCount++;
        } else {
          wrongCount++;
        }
      } else {
        skippedCount++;
      }
    });

    setScore({
      rightAns: rightCount,
      wrongAns: wrongCount,
      skipped: skippedCount,
    });
  }, [start_Test, userTestAnsData]);

  useEffect(() => {
    if (start_Test) {
      setSetNo(start_Test?.test[0]?.set_No);
    }
  }, [start_Test]);

  useEffect(() => {
    if (setNo) {
      setLoading(true);
      const timer = setTimeout(() => fetchRankData(setNo), 5000);
      return () => clearTimeout(timer);
    }
  }, [setNo]);

  const fetchRankData = async (setNo) => {
    if (!user?.id) {
      setError("User ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/100YoRE/Top_10.php?user_id=${user.id}&topcode=${subject.selectedTopicCode}&subcode=${subject.subjectCode}&set_No=${setNo}`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setRecord(data[1][0].rank);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = Object.keys(start_Test?.test || {}).length || 0;

  const roundedScore =
    totalQuestions > 0
      ? (score.rightAns - score.wrongAns * (1 / 3)).toFixed(2)
      : "0.00";

  const percentage =
    totalQuestions > 0
      ? ((roundedScore / totalQuestions) * 100).toFixed(2)
      : "0.00";

  const accuracy =
    score.rightAns > 0
      ? ((score.rightAns / (score.rightAns + score.wrongAns)) * 100).toFixed(2)
      : "0.00";

  const bgColor = (() => {
    if (percentage < 33) return "#DB5353";
    if (percentage < 50) return "#DB9153";
    if (percentage < 75) return "#53C0DB";
    if (percentage < 95) return "#53DB5B";
    return "#E7E556";
  })();

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds} s`;
  };

  return (
    <div
      className="row m-1 mt-2 mb-2"
      style={{
        boxShadow: "5px 5px 10px rgba(0,0,0, 0.3)",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "5px",
        background: `linear-gradient(to bottom, white, ${bgColor})`,
      }}
    >
      <div className="col-10">
        <h5>
          <GrScorecard /> {user.name}`s score card
        </h5>
        <hr />
        <div className="container text-center">
          <div className="row align-items-start">
            <ScoreSection
              title="Question Status"
              items={[
                `Total Questions - ${totalQuestions}`,
                `Attempted - ${score.rightAns + score.wrongAns}`,
                `Skipped - ${score.skipped}`,
              ]}
              screenSize={screenSize}
            />
            <ScoreSection
              title="Your Attempts"
              items={[`Right - ${score.rightAns}`, `Wrong - ${score.wrongAns}`]}
              screenSize={screenSize}
            />
            <ScoreSection
              title="Score"
              items={[
                `For Right Ans. +${score.rightAns}`,
                `For Wrong Ans. -${(score.wrongAns * (1 / 3)).toFixed(2)}`,
                `Percentage - ${percentage}%`,
              ]}
              screenSize={screenSize}
            />
            <ScoreSection
              title="Time & Accuracy"
              items={[
                `Time for Test - ${countDown?.testTiming}:00 s`,
                `Time Used in Test - ${convertSecondsToMinutesAndSeconds(
                  countDown?.timeTaken
                )}`,
                `Accuracy - ${accuracy}%`,
              ]}
              screenSize={screenSize}
            />
          </div>
        </div>
      </div>
      <div className="col-2 text-center">
        {loading ? <Loading /> : <h6>Your Rank = {record ? record : "-"}</h6>}
        {record ? (
          <div style={{ fontSize: "10px" }}>when test was conducted</div>
        ) : null}
        <hr />
        <h5>Final Score</h5>
        <hr />
        <b className="final-score">{roundedScore}</b>
      </div>
      <style jsx>{`
        .final-score {
          font-size: 70px;
        }
        @media (max-width: 1200px) {
          .final-score {
            font-size: 60px;
          }
        }
        @media (max-width: 992px) {
          .final-score {
            font-size: 50px;
          }
        }
        @media (max-width: 768px) {
          .final-score {
            font-size: 40px;
          }
        }
        @media (max-width: 576px) {
          .final-score {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

const ScoreSection = ({ title, items, screenSize }) => (
  <div className="col-12 col-md-3">
    {screenSize.width < 760 && <hr />}
    <h5 className="row">{title}</h5>
    {screenSize.width >= 760 && <hr />}
    {items.map((item, index) => (
      <div key={index} className="row">
        {item}
      </div>
    ))}
  </div>
);

export default UserScoreCard;
