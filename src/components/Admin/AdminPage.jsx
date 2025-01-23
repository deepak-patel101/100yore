import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";
import { MdFindInPage } from "react-icons/md";
import { FaDatabase } from "react-icons/fa";
import Loading from "../Loading";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [databaseCount, setDataBaseCount] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDatabaseCount = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/DataBaseSummary.php`
      );
      const data = await response.json();
      setDataBaseCount(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleDatabaseCount();
  }, []);

  if (user?.login_type === "admin") {
    return (
      <div className="container papaDiv ">
        <h5>Welcome, {user?.name} sir !</h5>

        <hr />
        <div className="row m-2">
          <div
            className="col-12 col-md-4  "
            style={{ minHeight: "370px", maxHeight: "450px", overflow: "auto" }}
          >
            <ul
              className="text-start papaDiv "
              style={{
                listStyleType: "none",
                marginLeft: "0px",
                paddingLeft: "5px ",
              }}
            >
              <h5>
                <MdFindInPage />
                &nbsp;Pages
              </h5>
              <hr />
              {user?.username === "sachet" ? (
                <div>
                  <li>
                    <Link to="/Admin/Q-Bank" className="nev-item">
                      Add Qbank
                    </Link>
                  </li>
                </div>
              ) : (
                <div>
                  {" "}
                  <li>
                    <Link to="/Admin/Q-Bank" className="nev-item">
                      Add Qbank
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/Edit-Q-Bank" className="menu-item">
                      Modify Qbank
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/McqModification" className="menu-item">
                      Modify
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/ShowFeedback" className="menu-item">
                      Show website Feedback
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/FatchQbankFeedback" className="menu-item">
                      Show MCQ Feedback
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/MCQverifier" className="menu-item">
                      MCQ verifier
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/AddVideolinks" className="menu-item">
                      Add Video Links
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/AddDept" className="menu-item">
                      Add Department
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/VideoApproval" className="menu-item">
                      Video Approval
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/SummaryVideo" className="menu-item">
                      Video Summary
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/VideoModification" className="menu-item">
                      Video Modification
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/Feedback" className="menu-item">
                      FeedBack
                    </Link>
                  </li>{" "}
                  <li>
                    <Link to="/Admin/DeletedQuestion" className="menu-item">
                      Deleted Questions
                    </Link>
                  </li>{" "}
                  <li>
                    <Link to="/Admin/Edit_dep_sub_topic" className="menu-item">
                      Edit dep.,sub.,topic
                    </Link>
                  </li>
                  <li>
                    <Link to="/Admin/Duplicate_Topic" className="menu-item">
                      Duplicate Topic
                    </Link>
                  </li>
                </div>
              )}
            </ul>
          </div>{" "}
          <div
            className="col-12 col-md-8 papaDiv"
            style={{ minHeight: "370px", maxHeight: "450px", overflow: "auto" }}
          >
            <h5 className="text-start position-fix">
              <FaDatabase />
              &nbsp;DataBase contains
            </h5>
            <hr />
            <div className="row">
              {loading ? <Loading /> : null}
              {Object.entries(databaseCount).map(([item, value], index) => {
                if (item !== "Todays_Count") {
                  return (
                    <div key={index} className="col-12 col-md-4 mb-1 mt-1">
                      <div className="card Subject">
                        <div
                          className="card-header"
                          style={{
                            background:
                              "linear-gradient(to bottom, white, #B7EDB5)",
                          }}
                        >
                          {item}
                        </div>
                        <div className="card-body">
                          <blockquote className="blockquote mb-0">
                            <h4>{value}</h4>
                            <footer
                              className="blockquote-footer text-end mt-2"
                              style={{ fontSize: "12px" }}
                            >
                              {item !== "VISITORS" ? (
                                `Total ${item}`
                              ) : (
                                <b>
                                  and Todays -{" "}
                                  {Object.entries(databaseCount).map(
                                    ([subItem, subValue], subIndex) => {
                                      if (subItem === "Todays_Count")
                                        return subValue;
                                      return null;
                                    }
                                  )}
                                </b>
                              )}
                            </footer>
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (user?.login_type === "user") {
    return (
      <div className="admin-container">
        <div className="admin-container">
          <h2>Welcome, {user?.name} Sir!!!</h2>
          <ul className="admin-menu">
            <li>
              <Link to="/InspectionNote" className="menu-item">
                Note
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  } else if (user?.login_type === "partener") {
    return (
      <div className="admin-container">
        <div className="admin-container">
          <h2>Welcome, {user?.name} Sir!!!</h2>
          <ul className="admin-menu">
            <li>
              <Link to="/AddVideolinksPartner" className="menu-item">
                Add Video
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    navigate("/LoginForm");
  }
};

export default AdminPage;
