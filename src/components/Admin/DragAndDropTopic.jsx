import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import "./DND.css";
const DragDropTopic = () => {
  const [data, setData] = useState([]);
  const [selection, setSelection] = useState("subject");
  const [departments, setDepartments] = useState([]);
  const [department1, setDepartment1] = useState("");
  const [department2, setDepartment2] = useState("");
  const [tempData1, setTempData1] = useState([]);
  const [tempData2, setTempData2] = useState([]);
  const [dpetName1, setDpetName1] = useState([]);
  const [dpetName2, setDpetName2] = useState([]);

  useEffect(() => {
    departments.forEach((dept) => {
      if (dept.depttcode == department1) {
        setDpetName1(dept.deptt);
      }
      if (dept.depttcode == department2) {
        setDpetName2(dept.deptt);
      }
    });
  }, [department1, department2, departments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://railwaymcq.com/railwaymcq/MCQTown/Fetch_depart_sub_topic.php"
        );
        const fetchedData = result.data;
        setData(fetchedData);

        const uniqueDepartments = fetchedData.map((dept) => ({
          depttcode: dept.depttcode,
          deptt: dept.deptt,
        }));
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (department1) {
      const dept1Data = data.find(
        (dept) => dept.depttcode === parseInt(department1)
      );
      setTempData1(dept1Data ? Object.values(dept1Data.subjects) : []);
    }
    if (department2) {
      const dept2Data = data.find(
        (dept) => dept.depttcode === parseInt(department2)
      );
      setTempData2(dept2Data ? Object.values(dept2Data.subjects) : []);
    }
  }, [department1, department2, data]);

  // const onDragEnd = (result) => {
  //   const { source, destination, draggableId, type } = result;
  //   if (!destination) return;

  //   const tempData1Clone = [...tempData1];
  //   const tempData2Clone = [...tempData2];

  //   if (type === "subject") {
  //     const sourceItems =
  //       source.droppableId === "tempData1" ? tempData1Clone : tempData2Clone;
  //     const destItems =
  //       destination.droppableId === "tempData1"
  //         ? tempData1Clone
  //         : tempData2Clone;
  //     const [movedSubject] = sourceItems.splice(source.index, 1);
  //     destItems.splice(destination.index, 0, movedSubject);
  //     setTempData1(tempData1Clone);
  //     setTempData2(tempData2Clone);
  //   } else if (type === "topic") {
  //     const [sourceDept, sourceSub] = source.droppableId.split("-");
  //     const [destDept, destSub] = destination.droppableId.split("-");

  //     const sourceDeptData =
  //       sourceDept === "tempData1" ? tempData1Clone : tempData2Clone;
  //     const destDeptData =
  //       destDept === "tempData1" ? tempData1Clone : tempData2Clone;

  //     const sourceSubject = sourceDeptData.find(
  //       (sub) => sub.subcode.toString() === sourceSub
  //     );
  //     const destSubject = destDeptData.find(
  //       (sub) => sub.subcode.toString() === destSub
  //     );

  //     const [movedTopic] = sourceSubject.topics.splice(source.index, 1);
  //     destSubject.topics.splice(destination.index, 0, movedTopic);

  //     setTempData1(tempData1Clone);
  //     setTempData2(tempData2Clone);
  //   }
  // };
  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    const tempData1Clone = [...tempData1];
    const tempData2Clone = [...tempData2];

    if (type === "subject") {
      const sourceItems =
        source.droppableId === "tempData1" ? tempData1Clone : tempData2Clone;
      const destItems =
        destination.droppableId === "tempData1"
          ? tempData1Clone
          : tempData2Clone;
      const [movedSubject] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedSubject);
      setTempData1(tempData1Clone);
      setTempData2(tempData2Clone);

      // Log for subject transfer including topics
      console.log({
        sentFrom: {
          department: source.droppableId,
          subjectCode: movedSubject.subcode,
          subjectName: movedSubject.sub,
          topics: movedSubject.topics.map((topic) => ({
            topicName: topic.topic,
            topicCode: topic.topcode,
          })),
        },
        sentTo: {
          department: destination.droppableId,
          subjectCode: movedSubject.subcode,
          subjectName: movedSubject.sub,
          topics: movedSubject.topics.map((topic) => ({
            topicName: topic.topic,
            topicCode: topic.topcode,
          })),
        },
      });
    } else if (type === "topic") {
      const [sourceDept, sourceSub] = source.droppableId.split("-");
      const [destDept, destSub] = destination.droppableId.split("-");

      const sourceDeptData =
        sourceDept === "tempData1" ? tempData1Clone : tempData2Clone;
      const destDeptData =
        destDept === "tempData1" ? tempData1Clone : tempData2Clone;

      const sourceSubject = sourceDeptData.find(
        (sub) => sub.subcode.toString() === sourceSub
      );
      const destSubject = destDeptData.find(
        (sub) => sub.subcode.toString() === destSub
      );

      const [movedTopic] = sourceSubject.topics.splice(source.index, 1);
      destSubject.topics.splice(destination.index, 0, movedTopic);

      setTempData1(tempData1Clone);
      setTempData2(tempData2Clone);

      // Log for topic transfer
      console.log({
        sentFrom: {
          department: sourceDept,
          subjectCode: sourceSubject.subcode,
          subjectName: sourceSubject.sub,
          topicCode: movedTopic.topcode,
          topicName: movedTopic.topic,
        },
        sentTo: {
          department: destDept,
          subjectCode: destSubject.subcode,
          subjectName: destSubject.sub,
          topicCode: movedTopic.topcode,
          topicName: movedTopic.topic,
        },
      });
    }
  };

  return (
    <div className="container ">
      <div className="papaDiv">
        <h3>Select Transfer Type</h3>
        <select
          className="form-select"
          onChange={(e) => setSelection(e.target.value)}
          value={selection}
        >
          <option value="subject">Subject</option>
          <option value="topic">Topic</option>
        </select>
        <h3>Select Departments</h3>

        <div className="row">
          <div className="col-md-6">
            <select
              className="form-select"
              onChange={(e) => setDepartment1(e.target.value)}
              value={department1}
            >
              <option value="">Select Department 1</option>
              {departments.map((dept) => (
                <option key={dept.depttcode} value={dept.depttcode}>
                  {dept.deptt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            {" "}
            <select
              className="form-select"
              onChange={(e) => setDepartment2(e.target.value)}
              value={department2}
            >
              <option value="">Select Department 2</option>
              {departments.map((dept) => (
                <option key={dept.depttcode} value={dept.depttcode}>
                  {dept.deptt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {[tempData1, tempData2].map((tempData, idx) => (
            <Droppable
              droppableId={`tempData${idx + 1}`}
              type="subject"
              key={idx}
            >
              {(provided, snapshot) => (
                <div
                  className="col-md-6 "
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div
                    className={
                      snapshot.isDraggingOver
                        ? "active-dropLocation m-1 p-2  "
                        : "m-1 p-2 from-border "
                    }
                  >
                    <h5> {idx + 1 === 1 ? dpetName1 : dpetName2}</h5>
                    {tempData && tempData.length > 0 ? (
                      tempData.map((subject, subjectIndex) => (
                        <Draggable
                          draggableId={`subject-${subject.subcode}`}
                          index={subjectIndex}
                          key={subject.subcode}
                        >
                          {(provided, snapshot2) => (
                            <div
                              className={
                                snapshot2.isDragging
                                  ? " active-animation Subject"
                                  : "Subject "
                              }
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: "8px",
                                margin: "4px",
                                marginBottom: "8px",
                                backgroundColor: snapshot2.isDragging
                                  ? "#b3d8f9"
                                  : "#e0e0e0",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {" "}
                              <h6>{subject.sub}</h6>
                              {selection === "topic" && (
                                <Droppable
                                  droppableId={`${
                                    idx === 0 ? "tempData1" : "tempData2"
                                  }-${subject.subcode}`}
                                  type="topic"
                                >
                                  {(provided, subjectSnapshot) => (
                                    <div
                                      className={
                                        subjectSnapshot.isDraggingOver
                                          ? "active-dropLocation m-1 p-2  "
                                          : "m-1 p-2 from-border "
                                      }
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      style={{ paddingLeft: "10px" }}
                                    >
                                      {subject.topics.map(
                                        (topic, topicIndex) => (
                                          <Draggable
                                            key={topic.topcode}
                                            draggableId={`topic-${topic.topcode}`}
                                            index={topicIndex}
                                          >
                                            {(provided, topicSnapshot2) => (
                                              <div
                                                className={
                                                  topicSnapshot2.isDragging
                                                    ? " active-animation Subject"
                                                    : "Subject "
                                                }
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  padding: "6px",
                                                  margin: "2px",
                                                  backgroundColor:
                                                    topicSnapshot2.isDragging
                                                      ? "#b3d8f9"
                                                      : "#e0e0e0",
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                              >
                                                {topic.topic}
                                              </div>
                                            )}
                                          </Draggable>
                                        )
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No subjects available in this department.</p>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DragDropTopic;
