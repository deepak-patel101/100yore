import React, { useEffect } from "react";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import LeadersBoardTop from "./LeadersBoardTop";
import LeadersBoardBody from "./LeadersBoardBody";
const LeadersBoard = () => {
  const { setActivePage, activePage, setSearchKeyWords } = useGlobalContext();
  useEffect(() => {
    setActivePage("leadersBoard");
  }, [activePage]);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <LeadersBoardTop />
      {/* <LeadersBoardBody /> */}
    </div>
  );
};
export default LeadersBoard;
