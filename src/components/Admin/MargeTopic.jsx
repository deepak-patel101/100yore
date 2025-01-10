import React, { useState } from "react";
import { BsSignMergeLeftFill } from "react-icons/bs";
import { MdAutoDelete } from "react-icons/md";
import Loading from "../Loading";
const MargeTopic = ({ data, mData, setMergeResponse }) => {
  const [margeData, setMargeData] = useState([]);
  const [responseMessage, setResponseMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleMerge = (pushData) => {
    setMargeData((prevData) => {
      const exists = prevData.some(
        (item) =>
          item.topcode === pushData.topcode && item.subcode === pushData.subcode
      );

      if (exists) {
        // Remove the matching item
        return prevData.filter(
          (item) =>
            !(
              item.topcode === pushData.topcode &&
              item.subcode === pushData.subcode
            )
        );
      } else {
        // Add the new combination
        return [
          ...prevData,
          { topcode: pushData.topcode, subcode: pushData.subcode },
        ];
      }
    });
  };

  const handleMargeSubmit = async () => {
    let userConfirmed;
    userConfirmed = window.confirm(
      "Are you sure...? Question will be merged and topic will be deleted"
    );
    if (userConfirmed) {
      try {
        setLoading(true);
        const response = await fetch(
          "https://railwaymcq.com/railwaymcq/MCQTown/merge_topic.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              object: { subcode: mData.subcode, topcode: mData.topcode },
              arrayOfObjects: margeData,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        setResponseMessage(responseData.message || "Update successful!");
        setMergeResponse(responseData);
        setLoading(false);
      } catch (error) {
        setResponseMessage(error.message || "An error occurred!");
        setLoading(false);
      }
    }
  };

  return (
    <div className="m-3">
      <div>
        <div className="m-3" style={{ maxWidth: "90vw" }}>
          <h6>Merging Data with </h6>
          <hr />
          <div className="d-flex flex-wrap">
            {" "}
            <b>Dept-</b>
            {mData.deptt} ,<b>Sub-</b>
            {mData.sub} , <b>topic-</b>
            {mData?.topic} ,<b>Que-</b>
            {mData.questions}
          </div>
        </div>
        <b>Select to merge</b>

        <div
          style={{
            maxHeight: "50vh",

            overflowY: "auto",
            border: "1px solid #a3d2fc",
          }}
        >
          <table
            className="table table-striped Subject"
            style={{ borderCollapse: "separate", borderSpacing: "0" }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#f8f9fa",
              }}
            >
              <tr className="table-primary">
                <th>Sno</th>
                <th>Department</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((entry, idx) => {
                if (entry?.topcode !== mData.topcode) {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{entry.deptt}</td>
                      <td>{entry.sub}</td>
                      <td>{entry.questions}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onClick={() => handleMerge(entry)}
                          ></input>
                        </div>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>

        <div>
          <div className="" style={{ maxWidth: "70vw" }}>
            {" "}
            <b>TopCode to be merged </b>
            <div className="d-flex flex-wrap">
              {margeData?.map((item, index) => (
                <p key={index}>{item?.topcode},</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <button
          className="btn btn-sm btn-outline-success"
          onClick={handleMargeSubmit}
        >
          Marge
        </button>
        {loading ? <Loading /> : null}
      </div>
    </div>
  );
};
export default MargeTopic;
