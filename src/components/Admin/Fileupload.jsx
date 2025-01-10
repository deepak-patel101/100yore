import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { useGlobalContext } from "../../Context/GlobalContextOne";
import { FaFileUpload } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { FaUpload } from "react-icons/fa";
import ExcelExample from "../../img/excelExample.jpg";
import { MdNearbyError } from "react-icons/md";
import UniPop from "../UniPop";
import Loading from "../Loading";

const FileUpload = () => {
  const { departments, fetchMastInfo } = useGlobalContext();
  const [file, setFile] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [selectedSubcode, setSubcode] = useState(""); // renamed from subcode
  const [releaseDate, setReleaseDate] = useState(""); // renamed from subcode
  const [releaseTime, setReleaseTime] = useState("");

  const [department, setDepartment] = useState("");
  const [topcode, setTopcode] = useState("");
  const [depttCode, setDepttCode] = useState("");
  const [viewExample, setViewExample] = useState(false);
  const [queFrom, setQueFrom] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCo, setLoadingCo] = useState(false);
  const [count, setCount] = useState({
    QInDept: 0,
    QInSub: 0,
    QInTop: 0,
  });
  const [count1, setCount1] = useState();

  const [excelMsg, setExcelMsg] = useState(false);
  const [fileTypeCheck, setFileTypeCheck] = useState(false);
  const fileInputRef = useRef(null); // Create a ref for the file input
  useEffect(() => {
    if (department) {
      const foundDept = departments.find((key) => key.deptt === department);
      if (foundDept) {
        setDepttCode(foundDept.depttcode);
      }
    }
  }, [department, departments]);

  useEffect(() => {
    setSubcode("");
  }, [department]);

  const handleFileChange = (e) => {
    setExcelMsg(false);
    setFileTypeCheck(false);
    const selectedFile = e.target.files[0];

    // Check if a file is selected
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    // Check file type
    if (
      ![
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(selectedFile.type)
    ) {
      setFileTypeCheck(true);
      // alert("Please select a valid Excel file.");
      e.target.value = null; // Reset the file input
      return;
    }

    // Proceed with setting the file state
    setFile(selectedFile);
  };
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    // Optional: Add validation or formatting logic here
    setReleaseDate(selectedDate);
  };
  const handleTimeChange = (e) => {
    setReleaseTime(e.target.value);
  };
  const handleFileUpload = () => {
    // Validate the file type before processing
    if (
      ![
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      alert("Please select a valid Excel file.");
      setFile(null);
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const sanitizedData = jsonData.map((row) => {
        Object.keys(row).forEach((key) => {
          if (typeof row[key] === "string") {
            // Remove extra backslashes before single and double quotes specifically
            row[key] = row[key].replace(/\\(['"])/g, "$1");
          }
        });
        return row;
      });

      const keysArray = [
        "Question",
        "Option1",
        "Option2",
        "Option3",
        "Option4",
        "Answer",
        // "Reference",
        // "Difficulty",
      ]; // Example array of keys to check

      const hasAllKeys = keysArray.every((key) => key in jsonData[0]);

      // Include the additional input data
      const payload = {
        selectedSubcode,
        topcode,
        queFrom,
        releaseDate,
        releaseTime,
        data: sanitizedData,
      };

      if (hasAllKeys) {
        setExcelMsg(false);
        let payloadStr = JSON.stringify(payload).replace(/\\'/g, "'");

        // Send data to the backend with the cleaned JSON string
        fetch(
          "https://railwaymcq.com/railwaymcq/100YoRE/InsertMCQfromExcel.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: payloadStr,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            if (data.message === "Process completed") {
              setFile(null);
              setResultData(data);
              setShowResult(true);
              if (fileInputRef.current) {
                fileInputRef.current.value = null;
                fetchMastInfo();
              }
            } else {
              alert(data.message);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            setLoading(false);
          });
      } else {
        setLoading(false);
        setExcelMsg(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSampleFile = () => {
    setViewExample(true);
  };

  // /////////////////////////////////////////////////////////
  const countQue = async () => {
    setLoadingCo(true); // Start loading
    try {
      // Build the request URL with query parameters
      const params = new URLSearchParams({
        depttcode: depttCode || "",
        subcode: selectedSubcode || "",
        topcode: topcode || "",
        queFrom: queFrom || "",
      });

      // Fetch data from the API
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/MCQTown/count_No_Of_Question.php?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCount1(data); // Store the result in state
      setLoadingCo(false); // Stop loading
    } catch (error) {
      console.error("Failed to fetch data from the server");
    } finally {
      setLoadingCo(false); // Stop loading
    }
  };
  // Depend only on necessary states

  useEffect(() => {
    // Trigger data fetching on mount or when dependencies change
    countQue();
  }, [topcode, selectedSubcode, depttCode, queFrom]);
  useEffect(() => {
    setTopcode("");
    setSubcode("");
    setQueFrom("");
    setCount((prevCount) => ({
      ...prevCount,
      QInSub: 0,
      QInTop: 0,
    }));
  }, [department]);

  useEffect(() => {
    setTopcode("");
    setQueFrom("");
    setCount((prevCount) => ({
      ...prevCount,
      QInTop: 0,
    }));
  }, [selectedSubcode]);

  useEffect(() => {
    setQueFrom("");
  }, [topcode]);

  useEffect(() => {
    // Ensure you're working with up-to-date state values.
    setCount((prevCount) => {
      let newCount = { ...prevCount };

      departments.forEach((obj) => {
        if (obj.deptt === department) {
          newCount.QInDept = obj.total_questions;

          Object.entries(obj.subjects).forEach(([subCode, object]) => {
            if (selectedSubcode === subCode) {
              newCount.QInSub = object.total_questions;

              object.topics.forEach((topobj) => {
                if (topobj.topcode === topcode) {
                  newCount.QInTop = topobj.questions;
                }
              });
            }
          });
        }
      });

      return newCount;
    });
  }, [department, selectedSubcode, topcode]);

  // /////////////////////////////////////////////////////////
  return (
    <div>
      {showResult ? (
        <UniPop
          state={showResult}
          setState={setShowResult}
          resultData={resultData}
          from={"fileUpload"}
        ></UniPop>
      ) : null}
      {viewExample ? (
        <div
          className=""
          style={{
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
            zIndex: "20",
          }}
          onClick={() => setViewExample(false)}
        >
          <div
            className="position-relative m-3 "
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
              onClick={() => setViewExample(false)}
            >
              <IoCloseCircleSharp
                style={{
                  color: "red",
                  boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div className="p-1 " style={{ maxWidth: "900px" }}>
              <img
                className="img-fluid"
                src={ExcelExample}
                alt="example Image"
                style={{
                  width: "100%",
                  height: "auto",
                  boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)", // Shadow on bottom-right
                  padding: "15px",
                  marginBottom: "15px", // Adding some margin at the bottom for spacing
                  borderRadius: "5px", // Adding border radius for rounded corners
                  backgroundColor: "#ffffff", // Adding background color to the div
                }}
              />
              <h6 className="row m-1 " style={{ color: "red" }}>
                Note- 1,columns name must be same as this table <br />
                2, Difficulty is now not mandatory ,default value = 1
              </h6>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div
        style={{
          boxShadow: "5px 5px 10px rgba(52,80,142, 0.3)", // Shadow on bottom-right
          padding: "15px",
          marginBottom: "15px", // Adding some margin at the bottom for spacing
          borderRadius: "5px", // Adding border radius for rounded corners
          backgroundColor: "#ffffff", // Adding background color to the div
        }}
      >
        <div className="text-start">
          <h5>
            <FaFileUpload /> Upload mcq using Excel Sheet{" "}
          </h5>
          <hr />
        </div>
        <div className="row ">
          <div className="col col-12 mb-2 col-md-3 mb-1">
            <div
              className="d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              {" "}
              <div
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex "
              >
                {" "}
                Select Department
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </div>
              <div className="">
                <div>Q: {count?.QInDept}</div>
              </div>
            </div>

            <select
              className=" Subject form-select "
              value={department}
              onChange={(e) => {
                const selectedDepartment = departments[e.target.value];
                setDepartment(e.target.value);
                if (selectedDepartment) {
                  setCount({
                    ...count,
                    QInDept: selectedDepartment.total_questions,
                  });
                }
              }}
            >
              <option value="">Select Department</option>
              {departments &&
                Object.entries(departments)?.map(([key, departmentVal]) => (
                  <option
                    className="custom-select"
                    key={key}
                    value={departmentVal.deptt}
                    style={{
                      color:
                        departmentVal.total_questions < 10
                          ? "red"
                          : departmentVal.total_questions < 50
                          ? " blue"
                          : departmentVal.total_questions < 200
                          ? " orange"
                          : "green",
                    }}
                    onClick={() => {
                      setCount({
                        ...count,
                        QInDept: departmentVal.total_questions,
                      });
                    }}
                  >
                    {Number(key) + 1}, {departmentVal.deptt}
                    &nbsp;&nbsp;-&nbsp;&nbsp;
                    {departmentVal.total_questions}
                  </option>
                ))}
            </select>
          </div>
          <div className="col col-12 mb-2 col-md-3">
            {" "}
            <div
              className="d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              {" "}
              <div
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex "
              >
                {" "}
                Select Subject
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </div>
              <div className="">
                <div>Q: {count?.QInSub}</div>
              </div>
            </div>
            <select
              className=" Subject form-select "
              value={selectedSubcode}
              onChange={(e) => {
                setSubcode(e.target.value);
                // Reset topcode when changing subcode
                setTopcode("");
              }}
            >
              <option value="">Select Subject</option>
              {departments &&
                Object.entries(departments)?.map(([key, departmentVal]) => {
                  if (departmentVal.deptt === department) {
                    // Sort subjects based on total_questions in ascending order
                    const sortedSubjects = Object.entries(
                      departmentVal?.subjects
                    ).sort(
                      ([, a], [, b]) => a.total_questions - b.total_questions
                    );

                    return sortedSubjects.map(([subcode, subjects], index) => (
                      <option
                        key={subcode}
                        value={subcode}
                        style={{
                          color:
                            subjects.total_questions < 10
                              ? "red"
                              : subjects.total_questions < 50
                              ? "blue"
                              : subjects.total_questions < 200
                              ? "orange"
                              : "green",
                        }}
                        onClick={() =>
                          setCount({
                            ...count,
                            QInSub: subjects.total_questions,
                          })
                        }
                      >
                        {index + 1}, {subjects.sub} &nbsp;&nbsp;-&nbsp;&nbsp;{" "}
                        {subjects.total_questions}
                      </option>
                    ));
                  }
                  return null; // Return null if no match found
                })}
            </select>
          </div>
          <div className="col col-12 mb-2 col-md-3">
            {" "}
            <div
              className="d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              {" "}
              <div
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex "
              >
                {" "}
                Select Topic
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </div>
              <div className="">
                {" "}
                <div>Q: {count?.QInTop}</div>
              </div>
            </div>
            <select
              className="Subject form-select "
              value={topcode}
              onChange={(e) => setTopcode(e.target.value)}
            >
              <option value="">Select Topic</option>
              {selectedSubcode &&
                Object.entries(departments).map(([key, departmentVal]) => {
                  if (
                    departmentVal?.deptt === department &&
                    selectedSubcode !== "" &&
                    selectedSubcode !== undefined
                  ) {
                    if (departmentVal?.subjects[selectedSubcode]?.topics) {
                      return Object.entries(
                        departmentVal?.subjects[selectedSubcode]?.topics
                      ).map(([topcodeVal, topic], ind) => (
                        <option
                          key={topcodeVal}
                          value={topic.topcode}
                          style={{
                            color:
                              topic.questions < 10
                                ? "red"
                                : topic.questions < 50
                                ? " blue"
                                : topic.questions < 200
                                ? " orange"
                                : "green",
                          }}
                          onClick={() =>
                            setCount({ ...count, QInTop: topic.questions })
                          }
                        >
                          {ind + 1}, {topic.topic}&nbsp;&nbsp;-&nbsp;&nbsp;
                          {topic.questions}
                        </option>
                      ));
                    }
                  }
                  return null; // Return null if no match found
                })}
            </select>
          </div>
          <div className="col col-12 mb-2 col-md-3">
            <div
              className="d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              {" "}
              <div
                style={{ margin: "0px", padding: "0px" }}
                className="d-flex "
              >
                {" "}
                Source of MCQ
                <p style={{ color: "red", margin: "0px", padding: "0px" }}>
                  {" "}
                  *
                </p>
              </div>
              <div className="">
                {" "}
                {depttCode && selectedSubcode && topcode && queFrom ? (
                  loadingCo ? (
                    <div
                      style={{ height: "15px", width: "15px" }}
                      className="spinner-border"
                      role="status"
                    ></div>
                  ) : (
                    <div>Q: {count1?.QinQueFrom}</div>
                  )
                ) : (
                  <div>Q: {count1?.QinQueFrom}</div>
                )}
              </div>
            </div>

            <select
              className="form-select Subject"
              value={queFrom}
              onChange={(e) => setQueFrom(e.target.value)}
            >
              <option value="">Select Question from</option>
              <option value="default">Default / Other</option>
              {/* <option value="miscellaneous">miscellaneous</option> */}
              <option value="PDF">PDF</option>
              <option value="PYQ">PYQ</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <div className="row justify-content-center align-items-center ">
          <div className="col col-md-3">
            <p
              style={{ margin: "0px", padding: "0px" }}
              className="d-flex text-start"
            >
              Select release date and time
              <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
            </p>
            <div className="input-group Subject">
              <input
                className="form-control"
                type="date"
                value={releaseDate}
                onChange={handleDateChange}
                style={{
                  height: "40px",
                  paddingBottom: "0px",
                  marginBottom: "0px",
                }}
              />
              <input
                className="form-control"
                type="time"
                value={releaseTime}
                onChange={handleTimeChange}
                style={{
                  height: "40px",
                  paddingBottom: "0px",
                  marginBottom: "0px",
                  marginLeft: "5px",
                }}
              />
            </div>
          </div>

          <div className="col col-md-9">
            <p
              style={{ margin: "0px", padding: "0px" }}
              className="d-flex text-start"
            >
              {" "}
              Select excel file
              <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
            </p>

            <div className=" input-group Subject">
              <input
                className="form-control"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                ref={fileInputRef} // Assign ref to the file input
                style={{
                  height: "40px",
                  paddingBottom: "0px",
                  marginBottom: "0px",
                }}
              />

              <button
                style={{
                  height: "40px",
                  paddingBottom: "0px",
                  marginBottom: "0px",
                }}
                className={`btn btn-sm  ${
                  selectedSubcode !== "" && file && topcode !== ""
                    ? "btn-success"
                    : "btn-danger disabled"
                }`}
                onClick={handleFileUpload}
              >
                Upload
              </button>
            </div>
          </div>

          <div className="mt-2">
            {excelMsg ? (
              <div style={{ color: "red" }}>
                {" "}
                <MdNearbyError /> Excel file`s columns name didn`t match
              </div>
            ) : null}{" "}
            {fileTypeCheck ? (
              <div style={{ color: "red" }}>
                {" "}
                <MdNearbyError /> Please select a valid Excel file.
              </div>
            ) : null}
            <u
              className="m-1"
              style={{ cursor: "pointer", color: "#2FB44D" }}
              onClick={handleSampleFile}
            >
              <TbHelpSquareRoundedFilled style={{ fontSize: "15px" }} /> Click
              here for sample Excel file (note: now Difficulty in not
              mandatory,,default value = 1 )
            </u>
            {loading ? (
              <div className=" d-flex justify-content-center">
                <div>
                  <div className=" d-flex ">
                    {" "}
                    <FaUpload className="" />{" "}
                    <b className="">&nbsp; Uploading</b>
                  </div>
                  <div
                    style={{ width: "200px" }}
                    className="row progress"
                    role="progressbar"
                    aria-label="Animated striped example"
                    aria-valuenow="100%"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
