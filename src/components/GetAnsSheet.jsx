import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScoreCard from "../pages/ScoreCard";
import Loading from "./Loading";
import { useTestContext } from "../Context/TestContext";
import GoBackCom from "./GoBackCom";
const GetAnsSheet = () => {
  const location = useLocation();
  const data = location.state?.data;
  const [userResponse2, setUserResponse2] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false); // New state to handle delay
  const { start_Test } = useTestContext();

  const fetchAnswers = async () => {
    if (!data) {
      return;
    }
    setLoading(true);
    setError(null); // Reset error
    setShowScoreCard(false); // Ensure ScoreCard is not shown prematurely

    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/100YoRE/Fetch_Answer_Sheet.php?user_id=${data.user_id}&subcode=${data.subcode}&topcode=${data.topcode}&set_No=${data.set_No}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setUserResponse2(result); // Store the answers in state
    } catch (error) {
      setError(error.message); // Set error if there was a problem
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (data) {
      fetchAnswers();
    }
  }, [data]);

  useEffect(() => {
    if (!loading && !error && Object.keys(userResponse2).length > 0) {
      // Add a 3-second delay before showing ScoreCard
      const timer = setTimeout(() => {
        setShowScoreCard(true);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [loading, error, userResponse2]);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>Error: {error}</div>
      ) : showScoreCard ? (
        <div>
          {userResponse2.testAnswer.length <= 0 ? (
            <div className="mt-4 test-danger">
              <GoBackCom page={"Answer Sheet"} link={"/TestSeries"} />
              Oops No Record found we have data from 30/12/2024
            </div>
          ) : (
            <ScoreCard from={"GetAnsSheet"} userResponse2={userResponse2} />
          )}
        </div>
      ) : (
        <Loading /> // Placeholder during the 3-second delay
      )}
    </div>
  );
};

export default GetAnsSheet;
