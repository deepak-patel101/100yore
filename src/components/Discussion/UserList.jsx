import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";

const UserList = ({ from, selectedThread, replies }) => {
  const [groupedReplies, setGroupedReplies] = useState({});

  useEffect(() => {
    const groupRepliesByUname = (replies) => {
      return replies?.reduce((acc, reply) => {
        if (!acc[reply?.uname]) {
          acc[reply?.uname] = [];
        }
        acc[reply?.uname].push(reply);
        return acc;
      }, {});
    };

    if (replies) {
      const sortedData = groupRepliesByUname(replies);
      setGroupedReplies(sortedData);
    }
  }, [replies]);

  return (
    <div className="papaDiv">
      <div>
        <h6>Thread Creator</h6>
        <div style={{ fontSize: "12px" }}>
          Creator - {selectedThread?.uname}
        </div>
        <div style={{ fontSize: "12px" }}>
          Created On - {selectedThread?.created_at.slice(0, 10)}
        </div>{" "}
        <div style={{ fontSize: "12px" }}>Replies - {replies?.length}</div>
        <hr />
        <div
          className="  scrollspy-example-2"
          style={{
            height: "50vh",
            overflowY: "auto",
          }}
        >
          <div className=" " style={{ height: "50vh" }}>
            <h6>Participants of this Discussion</h6>
            {Object.entries(groupedReplies).map(([key, value], index) => (
              <div key={index} className=" Subject mb-2 m-2 underline ">
                <div
                  className="d-flex flex-column justify-content-start m-2 p-2"
                  style={{ fontSize: "12px" }}
                >
                  <div>
                    <FaUserAlt /> {key}
                  </div>

                  <div style={{ fontSize: "12px", color: "gray" }}>
                    {" "}
                    <RiMessage2Fill /> {value?.length} replie
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
