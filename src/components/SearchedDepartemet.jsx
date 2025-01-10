import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import DepartmentCarousel from "./DepartmentCarousel";
import { useUserContext } from "../Context/UserContext";
import Loading from "./Loading";
import { MdLeaderboard, MdNearbyError } from "react-icons/md";
const SearchedDepartment = ({ from }) => {
  const { departments, SearchKeyWord } = useGlobalContext();
  const { user } = useUserContext();
  const [userId, setUserId] = useState(3);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setUserId(user?.id);
  }, [user]);
  // Function to handle form submission

  const FetchData = async () => {
    setLoading(true);
    setError(null);

    // Properly encode the SearchKeyWord for URL
    const encodedKeyword = encodeURIComponent(SearchKeyWord);
    const apiUrl = `https://railwaymcq.com/railwaymcq/RailPariksha/Searched_MCQ_Dept.php?keyword=${encodedKeyword}&user_id=${userId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (SearchKeyWord && userId) {
      FetchData();
    }
  }, [SearchKeyWord, userId]);
  return (
    <div>
      {loading ? (
        <div>
          <h4>Loading Test... searching for {SearchKeyWord}</h4>
          <Loading />
        </div>
      ) : data?.message === "No MCQ Found" ? (
        <div style={{ color: "red" }}>
          {" "}
          <div className="text-start" style={{ color: "black" }}>
            <h5>
              <MdLeaderboard /> Departments{" "}
            </h5>
          </div>
          <MdNearbyError /> No MCQ found
        </div>
      ) : (
        <DepartmentCarousel departments={data} from={from} />
      )}

      <h1>{error}</h1>
    </div>
  );
};
export default SearchedDepartment;
