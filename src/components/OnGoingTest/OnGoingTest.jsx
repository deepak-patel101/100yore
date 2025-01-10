import React, { useEffect, useState } from "react";
import { useTestContext } from "../../Context/TestContext";
import { IoCloseCircleSharp } from "react-icons/io5";
import BodyOfOnGoing from "./BodyOfOnGoing";
const OnGoingTest = () => {
  const { test_ongoing_data } = useTestContext();
  const [openOngoingTest, setOpenOngoingTest] = useState(false);
  useEffect(() => {
    if (test_ongoing_data) {
      setOpenOngoingTest(true);
    }
  }, [test_ongoing_data]);
  return (
    <div>
      {openOngoingTest && (
        <div
          style={{
            margin: "0",
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw",
            zIndex: "1",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setOpenOngoingTest(false)}
        >
          <div
            className="position-relative p-2"
            style={{
              boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
              background: "white",
              borderRadius: "15px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
              style={{
                height: "20px",
                width: "20px",
                cursor: "pointer",
                background: "white",
                borderRadius: "50%",
                zIndex: "100",
              }}
              onClick={() => setOpenOngoingTest(false)}
            >
              <IoCloseCircleSharp
                style={{
                  color: "red",
                  boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <BodyOfOnGoing />
          </div>
        </div>
      )}
    </div>
  );
};
export default OnGoingTest;
