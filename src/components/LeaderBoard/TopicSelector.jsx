import React, { useState, useEffect } from "react";
import { useUserContext } from "../../Context/UserContext";
import Loading from "../Loading";
import axios from "axios";
import { useInitialContext } from "../../Context/InitialContext";
import { Form } from "react-bootstrap";
const TopicSelector = ({ setDataToper }) => {
  const [data, setData] = useState({});
  const { user } = useUserContext();
  const [depttcode, setDepttcode] = useState("");
  const [subcode, setSubcode] = useState("");
  const [topcode, setTopcode] = useState("");
  const [setNo, setSetNo] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [desig, setDesig] = useState(null);
  const [supervisor, setSupervisor] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [selCategory, setSelCategory] = useState(null);
  const [selDesignation, setSelDesignation] = useState(null);
  const [filters, setFilters] = useState({
    user_id: "",
    topcode: "",
    subcode: "",
    set_No: "",
    zone: "",
    division: "",
    depot: "",
  });

  const {
    SetZoneAndDivision,
    zoneAndDivisionInfoToFetch,
    railwayInfo: { railway_zone, railway_division, railway_depot },
    zoneAndDivisionData,
  } = useInitialContext();
  useEffect(() => {
    zoneAndDivisionInfoToFetch();
  }, []);
  const handleButtonClick = (e, type) => {
    // Determine the correct value based on the type
    if (type === "RAILWAY_ZONE") {
      SetZoneAndDivision({ target: { value: e.target.value } }, type);
    }
    if (type === "RAILWAY_DIVISION") {
      SetZoneAndDivision({ target: { value: e.target.value } }, type);

      setSelectedDivision(e.target.value);
    } else if (type === "RAILWAY_DEPOT") {
      SetZoneAndDivision({ target: { value: e.target.value } }, type);
      setSelectedDepot(e.target.value);
    }
    // Use the correct value and type in SetMaintenanceView
  };
  // // Fetch the initial hierarchical data
  // useEffect(() => {
  //   fetch("https://railwaymcq.com/railwaymcq/100YoRE/TopicSelector.php")
  //     .then((response) => response.json())
  //     .then((data) => setData(data.data))
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state before fetch
      setError(null); // Reset error state

      try {
        const response = await fetch(
          "https://railwaymcq.com/railwaymcq/100YoRE/TopicSelector.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data); // Update data state with fetched data
      } catch (error) {
        setError(error.message); // Update error state
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    setSelDesignation("");
  }, [selCategory]);
  // Function to fetch data from the PHP API
  const fetchRankData = async () => {
    SetZoneAndDivision({ target: { value: "" } }, "RAILWAY_ZONE");
    SetZoneAndDivision({ target: { value: "" } }, "RAILWAY_DIVISION");
    SetZoneAndDivision({ target: { value: "" } }, "RAILWAY_DEPOT");
    setRecords([]);
    setLoading(true);
    setSelCategory("");
    setError(null);
    setSelDesignation("");

    try {
      const response = await fetch(
        // https://railwaymcq.com/railwaymcq/100YoRE/Top_PDF.php?user_id
        `https://railwaymcq.com/railwaymcq/100YoRE/Top_10.php?user_id=${
          user ? user.id : "00"
        }&topcode=${topcode}&subcode=${subcode}&set_No=${setNo}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setRecords(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const filterByDepttCode = (data, code) => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value.depttcode === code)
    );

    for (const key in filtered) {
      const subcode1 = filtered[key].subjects[key].subcode;
      const topcode1 = filtered[key].subjects[key].topics[key].topcode;
      setSubcode(subcode1);
      setTopcode(topcode1);
    }

    return filtered;
  };

  // Filter data with depttcode = "56"

  useEffect(() => {
    filterByDepttCode(data, depttcode);
  }, [depttcode]);
  useEffect(() => {
    if (records.length > 0) {
      setDataToper(records[0]);
    } else {
      setDataToper(null);
    }
  }, [records]);

  const fetchFilterData = async () => {
    setLoading(true);
    setError("");

    try {
      // Construct the params object dynamically, including only non-empty values
      const params = {
        topcode: topcode, // Ensure topcode has a valid value
        subcode: subcode, // Ensure subcode has a valid value
        set_No: setNo, // Ensure setNo has a valid value
        user_id: user ? user.id : "00", // Use user.id if user is defined, else default to "00"
      };

      // Add optional parameters only if they are defined
      if (railway_zone) params.zone = railway_zone;
      if (railway_division) params.division = railway_division;
      if (railway_depot) params.depot = railway_depot;
      if (selCategory) params.category = selCategory;
      if (selDesignation) params.designation = selDesignation;

      const response = await axios.get(
        "https://railwaymcq.com/railwaymcq/100YoRE/Top_10T.php",
        { params }
      );
      // const [topUsersData, userData] = response.data;
      setRecords(response.data);
    } catch (err) {
      setError("Failed to fetch data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters({
      ...filters,
      user_id: user ? user.id : "00",
      topcode: topcode,
      subcode: subcode,
      set_No: setNo,
      zone: railway_zone,
      division: railway_division,
      depot: railway_depot,
    });
  }, [
    topcode,
    subcode,
    setNo,
    user,
    railway_zone,
    railway_division,
    railway_depot,
  ]);
  useEffect(() => {
    fetchFilterData();
  }, [filters, selCategory, selDesignation]);

  const fetchDESGMaster = async () => {
    const desg_flag = true;

    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?desg_flag=${desg_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDesig(data);
    } catch (error) {
      console.error("Error fetching DESG_MASTER info:", error);
    }
  };
  useEffect(() => {
    fetchDESGMaster();
  }, []);
  useEffect(() => {
    if (desig) {
      const uniqueCategories = [...new Set(desig.map((d) => d.category))];
      const uniqueDesignations = desig.map((d) =>
        selCategory === ""
          ? d.desg_name
          : selCategory === d.category
          ? d.desg_name
          : null
      );
      setSupervisor(uniqueCategories);
      setDesignation(uniqueDesignations);
    }
  }, [desig, selCategory]);

  return (
    <div>
      {/* Select Department */}

      <div className="row">
        <div className="col-md-4">
          {" "}
          <div>
            <label>Department:</label>
            <select
              className="form-select"
              onChange={(e) => setDepttcode(e.target.value)}
              value={depttcode}
            >
              <option value="">Select Department</option>
              {data &&
                Object.keys(data)?.map((depttKey) => (
                  <option key={depttKey} value={data[depttKey]?.depttcode}>
                    {depttKey}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <label>Set Number:</label>
            <br />

            <select
              className="form-select"
              onChange={(e) => setSetNo(e.target.value)}
              value={setNo}
            >
              <option value="">Select Set</option>
              {Object.keys(data)
                .filter((depttKey) => data[depttKey].depttcode === depttcode)
                .flatMap((depttKey) =>
                  Object.keys(data[depttKey]?.subjects || {})
                    .filter(
                      (subKey) =>
                        data[depttKey]?.subjects[subKey]?.subcode === subcode
                    )
                    .flatMap((subKey) =>
                      Object.keys(
                        data[depttKey]?.subjects[subKey]?.topics || {}
                      )
                        .filter(
                          (topicKey) =>
                            data[depttKey]?.subjects[subKey]?.topics[topicKey]
                              ?.topcode === topcode
                        )
                        .flatMap((topicKey) =>
                          data[depttKey]?.subjects[subKey]?.topics[
                            topicKey
                          ]?.sets.map((set) => set.set_No)
                        )
                    )
                )
                .map((setNo) => (
                  <option key={setNo} value={setNo}>
                    {setNo}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          {" "}
          {setNo && (
            <div>
              <br />
              <button
                className="btn  btn-outline-success"
                onClick={fetchRankData}
              >
                Fetch Records
              </button>
              {error ? <b style={{ color: "red" }}>{error}</b> : null}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <Form className="d-flex flex-row align-items-center">
          <div className="col-md-2 ms-1 me-1">
            {" "}
            <h6 className="m-1" style={{ whiteSpace: "nowrap" }}>
              Select zone
            </h6>
            <Form.Control
              className="m-1"
              as="select"
              value={railway_zone}
              onChange={(e) => handleButtonClick(e, "RAILWAY_ZONE")}
              required
            >
              <option value="">All</option>
              {zoneAndDivisionData &&
                zoneAndDivisionData.map((zoneData, index) =>
                  Object.keys(zoneData).map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))
                )}
            </Form.Control>
          </div>
          <div className="col-md-2 ms-1 me-1">
            {" "}
            {/* Division Dropdown */}
            <h6 className="m-1" style={{ whiteSpace: "nowrap" }}>
              Select division
            </h6>
            <Form.Control
              className="m-1"
              as="select"
              value={railway_division}
              onChange={(e) => handleButtonClick(e, "RAILWAY_DIVISION")}
              required
            >
              <option value="">All</option>
              {zoneAndDivisionData &&
                zoneAndDivisionData
                  .find((zoneData) => Object.keys(zoneData)[0] === railway_zone)
                  ?.[railway_zone]?.map((division, index) => (
                    <option key={index} value={division.division}>
                      {division.division}
                    </option>
                  ))}
            </Form.Control>
          </div>
          <div className="col-md-2 ms-1 me-1">
            {" "}
            {/* Depot Dropdown */}
            <h6 className="m-1" style={{ whiteSpace: "nowrap" }}>
              Select depot
            </h6>
            <Form.Control
              className="m-1"
              as="select"
              value={railway_depot}
              onChange={(e) => handleButtonClick(e, "RAILWAY_DEPOT")}
              required
            >
              <option value="">All</option>
              {zoneAndDivisionData &&
                zoneAndDivisionData
                  .find((zoneData) => Object.keys(zoneData)[0] === railway_zone)
                  ?.[railway_zone]?.find(
                    (div) => div.division === railway_division
                  )
                  ?.depots.map((depot, index) => (
                    <option key={index} value={depot.depot_name}>
                      {depot.depot_name}
                    </option>
                  ))}
            </Form.Control>
          </div>
          <div className="col-md-2 ms-1 me-1">
            {" "}
            <h6 className="m-1" style={{ whiteSpace: "nowrap" }}>
              Category
            </h6>
            <Form.Control
              className="m-1"
              as="select"
              value={selCategory}
              onChange={(e) => setSelCategory(e.target.value)}
              required
            >
              <option value="">All</option>
              {supervisor &&
                supervisor.map((superV, index) => (
                  <option key={index} value={superV}>
                    {superV}
                  </option>
                ))}
            </Form.Control>
          </div>
          <div className="col-md-2 ms-1 me-1">
            {" "}
            {/* Division Dropdown */}
            <h6 className="m-1" style={{ whiteSpace: "nowrap" }}>
              Designation
            </h6>
            <Form.Control
              className="m-1"
              as="select"
              value={selDesignation}
              onChange={(e) => setSelDesignation(e.target.value)}
              required
            >
              <option value="">All</option>
              {designation &&
                designation.map((desigN, index) =>
                  desigN === null ? null : (
                    <option key={index} value={desigN}>
                      {desigN}
                    </option>
                  )
                )}
            </Form.Control>
          </div>
        </Form>
      </div>
      {/* Select Subject */}
      {/* {depttcode && (
        <div>
          <label>Subject:</label>
          <select onChange={(e) => setSubcode(e.target.value)} value={subcode}>
            <option value="">Select Subject</option>
            {Object.keys(data)
              .filter((depttKey) => data[depttKey].depttcode === depttcode)
              .flatMap((depttKey) =>
                Object.keys(data[depttKey]?.subjects || {}).map((subKey) => ({
                  subKey,
                  subcode: data[depttKey]?.subjects[subKey]?.subcode,
                }))
              )
              .map(({ subKey, subcode }) => (
                <option key={subcode} value={subcode}>
                  {subKey}
                </option>
              ))}
          </select>
        </div>
      )} */}

      {/* Select Topic */}
      {/* {subcode && (
        <div>
          <label>Topic:</label>
          <select onChange={(e) => setTopcode(e.target.value)} value={topcode}>
            <option value="">Select Topic</option>
            {Object.keys(data)
              .filter((depttKey) => data[depttKey].depttcode === depttcode)
              .flatMap((depttKey) =>
                Object.keys(data[depttKey]?.subjects || {})
                  .filter(
                    (subKey) =>
                      data[depttKey]?.subjects[subKey]?.subcode === subcode
                  )
                  .flatMap((subKey) =>
                    Object.keys(
                      data[depttKey]?.subjects[subKey]?.topics || {}
                    ).map((topicKey) => ({
                      topicKey,
                      topcode:
                        data[depttKey]?.subjects[subKey]?.topics[topicKey]
                          ?.topcode,
                    }))
                  )
              )
              .map(({ topicKey, topcode }) => (
                <option key={topcode} value={topcode}>
                  {topicKey}
                </option>
              ))}
          </select>
        </div>
      )} */}

      {/* Select Set Number */}

      {/* Fetch Top Records Button */}

      {loading ? <Loading /> : null}
      {/* Display Top Records */}
      {records.message === "No data found" && !loading ? (
        <h6>NO DATA FOUND</h6>
      ) : null}
      {records.length > 0 && (
        <div>
          <h2>
            Top Records out of {records[2] && records[2]?.total_attendance}
          </h2>

          <table className="table  table-striped table-hover">
            <thead>
              <tr>
                <th className="table-success">Rank</th>
                <th className="table-success">Name</th>
                <th className="table-success">Depot</th>
                <th className="table-success">Designation</th>
                <th className="table-success">Total Questions</th>
                <th className="table-success">Question Attempted</th>
                <th className="table-success">Right Attempted</th>
                <th className="table-success">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) =>
                index === 0
                  ? record.map((obje, key) =>
                      key < 10 ? (
                        <tr key={key}>
                          <td className="text-center">{obje?.rank}</td>
                          <td className="text-center">
                            {obje?.user_data?.name?.toUpperCase()}
                          </td>
                          <td className="text-center">
                            {obje?.user_data?.depot_name?.toUpperCase()}
                          </td>{" "}
                          <td className="text-center">
                            {obje?.user_data?.post}
                          </td>
                          <td className="text-center">
                            {obje?.user_data?.total_questions}
                          </td>
                          <td className="text-center">
                            {obje?.user_data?.question_attempted}
                          </td>
                          <td className="text-center">
                            {obje?.user_data?.right_attempted}
                          </td>
                          <td className="text-center">
                            {obje?.user_data?.percentage}%
                          </td>
                        </tr>
                      ) : null
                    )
                  : null
              )}
              <tr>
                <td colSpan="8" className="text-center">
                  You got
                </td>
              </tr>
              {records.map((record, index) =>
                index === 1 ? (
                  record.length > 0 ? (
                    <tr key={index}>
                      <td className="text-center">{record[0]?.rank}</td>
                      <td className="text-center">{record[0]?.name}</td>
                      <td className="text-center">
                        {record[0]?.depot_name}
                      </td>{" "}
                      <td className="text-center">{record[0]?.post}</td>
                      <td className="text-center">
                        {record[0]?.total_questions}
                      </td>
                      <td className="text-center">
                        {record[0]?.question_attempted}
                      </td>
                      <td className="text-center">
                        {record[0]?.right_attempted}
                      </td>
                      <td className="text-center">{record[0]?.percentage}%</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        You have not attempted the test yet OR not belong to
                        this group
                      </td>
                    </tr>
                  )
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopicSelector;
