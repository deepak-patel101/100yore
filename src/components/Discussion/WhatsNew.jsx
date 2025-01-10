import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import { useNavigate } from "react-router-dom";

const WhatsNew = () => {
  const navigate = useNavigate();
  const { setThreadData, threadControl } = useGlobalContext();
  const [data, setData] = useState(null);
  const fetchMastInfo = async () => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/trending_discussion.php`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching SUBJECT_MASTER info:", error);
    }
  };
  useEffect(() => {
    fetchMastInfo();
  }, []);
  const handleSelectedThread = (data) => {
    setThreadData({ selectedThread: data });
    navigate("/MyIdeas/Start-Discussion");
  };
  return (
    <div style={{ height: "90vh", minWidth: "" }}>
      <h6 className="mt-3">Trending</h6>
      <hr />
      {data?.message !== "No results found" ? (
        data &&
        data?.slice(0, 10)?.map((item, index) => {
          return (
            <div
              className="Subject mb-2 underline"
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectedThread(item)}
            >
              <h6 style={{ fontSize: "12px" }}>{item?.title}</h6>
              <div className="ps-1 pe-1" style={{ fontSize: "11px" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: item?.content?.slice(0, 40),
                  }}
                  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p> Create a post and be at the top of Trending</p>
      )}
    </div>
  );
};
export default WhatsNew;
