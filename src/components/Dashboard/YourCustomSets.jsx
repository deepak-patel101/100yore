import React, { useEffect, useState } from "react";
import { useUserContext } from "../../Context/UserContext";
import ExportToPDF from "./ExportToPDF";
import EasyTest from "../EasyTest";
const YourCustomSets = () => {
  const { user } = useUserContext();
  const [test_data, setTest_data] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTestInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_Custom_Sets.php?user_id=${user?.id}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setLoading(false);
      setTest_data(data); // Update test_data only when from is "search"
    } catch (error) {
      setLoading(false);
      console.error("Error fetching SUBJECT_MASTER info:", error);
    }
  };
  console.log(test_data?.customSets?.test22);
  useEffect(() => {
    fetchTestInfo();
  }, []);
  return (
    <div className="container">
      <div className="papaDiv">
        <EasyTest from={"customSets"} loadingFrom={loading} />
      </div>
    </div>
  );
};
export default YourCustomSets;
