import React, { useEffect, useState } from "react";
import leader from "../../img/leader.jpg";
import TopicSelector from "./TopicSelector";
const LeadersBoardTop = () => {
  const [dataToper, setDataToper] = useState(null);
  const [firstName, setFirstName] = useState({});
  const [secondName, setSecondName] = useState({});
  const [thirdName, setThirdName] = useState({});

  useEffect(() => {
    if (dataToper) {
      if (dataToper.length > 0) {
        setFirstName({
          name: dataToper[0].user_data.name,
          depot: dataToper[0].user_data.depot_name,
        });
      } else {
        setFirstName(null);
      }
      if (dataToper.length > 1) {
        setSecondName({
          name: dataToper[1].user_data.name,
          depot: dataToper[1].user_data.depot_name,
        });
      } else {
        setSecondName(null);
      }
      if (dataToper.length > 2) {
        setThirdName({
          name: dataToper[2].user_data.name,
          depot: dataToper[2].user_data.depot_name,
        });
      } else {
        setThirdName(null);
      }
    }
  }, [dataToper]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden", // Prevents overflow during rotation
            zIndex: -1, // Keeps it in the background
            display: "flex", // Centers the image
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            className="rotating-background"
            src={Bg}
            alt="Background Animation"
            style={{
              width: "50vw", // Adjust size to fit within the container
              height: "50vh",
              objectFit: "cover", // Maintain aspect ratio
            }}
          />
        </div> */}

        <div className="row rotating-background">
          <h3>Leader`s Board</h3>
        </div>
        <div className="row"></div>
        {firstName ? (
          <div className="row">
            <div className="d-flex justify-content-center">
              <div
                className="col-md-6 position-relative"
                style={{
                  overflow: "hidden",
                }}
              >
                {/* Wrapper for positioning of first name */}
                <div
                  className="position-absolute"
                  style={{
                    top: "51%", // Adjust these values to match your design
                    left: "48%", // Adjust these values to match your design
                    transform: "translate(-50%, -50%)",
                    fontSize: "clamp(12px, 1vw, 20px)", // Responsive font size using clamp()
                  }}
                >
                  <div
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <b> {firstName?.name?.slice(0, 10)?.toUpperCase()}..</b>
                    <br />
                    {firstName?.depot?.toUpperCase()}
                  </div>
                </div>
                {/* //////////2nd name */}
                <div
                  className="position-absolute"
                  style={{
                    top: "89%", // Adjust these values to match your design
                    left: "16.5%", // Adjust these values to match your design
                    transform: "translate(-50%, -50%)",
                    fontSize: "clamp(12px, 1vw, 20px)", // Responsive font size using clamp()
                  }}
                >
                  <div
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <b> {secondName?.name?.slice(0, 10)?.toUpperCase()}..</b>
                    <br />
                    {secondName?.depot?.toUpperCase()}
                  </div>
                </div>
                {/* 3rd name */}
                <div
                  className="position-absolute"
                  style={{
                    top: "89%", // Adjust these values to match your design
                    left: "85%", // Adjust these values to match your design
                    transform: "translate(-50%, -50%)",
                    fontSize: "clamp(12px, 1vw, 20px)", // Responsive font size using clamp()
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      padding: "5px",
                      textAlign: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <b style={{ fontSize: "11px" }}>
                      {thirdName?.name?.slice(0, 10)?.toUpperCase()}..
                    </b>
                    <br />
                    {thirdName?.depot?.toUpperCase()}
                  </div>
                </div>
                <img
                  src={leader}
                  alt="user"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <TopicSelector setDataToper={setDataToper} />
    </div>
  );
};

export default LeadersBoardTop;
