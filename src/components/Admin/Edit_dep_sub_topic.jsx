import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import DragDropTopic from "./DragAndDropTopic";

const DragDropComponent = () => {
  const [data, setData] = useState([]);
  const [selection, setSelection] = useState("subject");
  const [departments, setDepartments] = useState([]);
  const [department1, setDepartment1] = useState("");
  const [department2, setDepartment2] = useState("");
  const [tempData1, setTempData1] = useState([]);
  const [tempData2, setTempData2] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://railwaymcq.com/railwaymcq/MCQTown/Fetch_depart_sub_topic.php"
        );
        const fetchedData = result.data;

        setData(fetchedData);

        // Extract unique departments
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

  // Update tempData based on selected departments
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

  // Handle Drag and Drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const tempData1Clone = [...tempData1];
    const tempData2Clone = [...tempData2];

    if (selection === "subject") {
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
    }
  };

  return (
    <div>
      {/* <h3>Select Transfer Type</h3>
      <select onChange={(e) => setSelection(e.target.value)} value={selection}>
        <option value="subject">Subject</option>
        <option value="topic">Topic</option>
      </select>
      <h3>Select Departments</h3>
      <select
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
      <select
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {[tempData1, tempData2].map((tempData, idx) => (
            <Droppable droppableId={`tempData${idx + 1}`} key={idx}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    minWidth: "250px",
                  }}
                >
                  <h4>
                    Department {idx + 1}:{" "}
                    {departments.find(
                      (d) =>
                        d.depttcode ===
                        parseInt(idx === 0 ? department1 : department2)
                    )?.deptt || "Select a Department"}
                  </h4>
                  {tempData && tempData.length > 0 ? (
                    tempData.map((subject, subjectIndex) => (
                      <div key={subject.subcode}>
                        {selection === "subject" ? (
                          <Draggable
                            draggableId={`subject-${subject.subcode}`}
                            index={subjectIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  padding: "8px",
                                  margin: "4px",
                                  backgroundColor: "#e0e0e0",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {subject.sub}
                              </div>
                            )}
                          </Draggable>
                        ) : (
                          <div>
                            <h5>{subject.sub}</h5>
                            <Droppable
                              droppableId={`subject-${subject.subcode}`}
                              key={subject.subcode}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  style={{ paddingLeft: "10px" }}
                                >
                                  {subject.topics.map((topic, topicIndex) => (
                                    <Draggable
                                      key={topic.topcode}
                                      draggableId={`topic-${topic.topcode}`}
                                      index={topicIndex}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            padding: "6px",
                                            margin: "2px",
                                            backgroundColor: "#c0c0c0",
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          {topic.topic}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No subjects available in this department.</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext> */}
      {/* /////////////////////////////////////////////////////////// */}

      <DragDropTopic />
    </div>
  );
};

export default DragDropComponent;
