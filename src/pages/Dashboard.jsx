import React, { useState } from "react";
import { useEffect } from "react";
import { useUserContext } from "../Context/UserContext";
import AddVideolinksPartner from "../components/Dashboard/AddVideolinksPartner";
import SideBar from "../components/Dashboard/SideBar";
import BeComeVideoPartner from "../components/Dashboard/BecomeVideoPartner";
import UpdateProfile from "../components/Dashboard/UpdateProfile";
import { useGlobalContext } from "../Context/GlobalContextOne";
import CustomSets from "../components/Dashboard/CustomSets";
import DashboardHome from "../components/Dashboard/DashboardHome";
import { IoHomeSharp } from "react-icons/io5";
import YourCustomSets from "../components/Dashboard/YourCustomSets";
const Dashboard = () => {
  const [actBtn, setActBtn] = useState("DASHBOARD");
  const { user } = useUserContext();
  const { setActivePage } = useGlobalContext();
  useEffect(() => {
    setActivePage("DashBoard");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  const handleSlide = () => {};
  useEffect(() => {
    handleSlide();
  }, [user]);

  return (
    <div className="container " style={{ minHeight: "90vh" }}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {handleSlide()} */}
        <div>
          <SideBar className="mt-2" setActBtn={setActBtn} />
        </div>
        <div>
          {actBtn ? (
            <div className="m-2 ps-4 pe-4 papaDiv">
              <h5>{actBtn}</h5>
            </div>
          ) : null}
        </div>
        <div>
          <button
            className="btn btn-outline-dark mb-2 Subject"
            onClick={() => {
              setActBtn("DASHBOARD");
            }}
          >
            <IoHomeSharp /> Dashboard
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center text-center">
        {/* <div className="col-12 col-md-4 ">
          <button
            className="btn btn-outline-success m-2  papaDiv "
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleNavigate("ADD-MCQ");
            }}
          >
            Add MCQ
          </button>
        </div> */}
      </div>
      {/* {actBtn === "ADD-MCQ" ? <QbankMaster /> : null} */}
      {actBtn === "ADD VIDOES" ? <AddVideolinksPartner /> : null}

      {user.login_type === "admin" ? null : actBtn ===
        "BECOME YOUTUBE PARTNER" ? (
        <BeComeVideoPartner />
      ) : null}
      {actBtn === "UPDATE PROFILE" ? <UpdateProfile /> : null}
      {actBtn === "DASHBOARD" ? <DashboardHome setActBtn={setActBtn} /> : null}
      {actBtn === "CUSTOM SETS" ? <CustomSets /> : null}
      {actBtn === "YOUR CUSTOM SETS" ? <YourCustomSets /> : null}
    </div>
  );
};
export default Dashboard;
