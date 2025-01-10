import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { FaFilePdf } from "react-icons/fa6";
import PdfReader from "./PdfReader";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleSharp } from "react-icons/io5";
import { PiExamFill } from "react-icons/pi";
import { useTestContext } from "../Context/TestContext";
import "./css/NoteReader.css"; // Import the custom CSS

const NotesReader = () => {
  const { subject, setSubject } = useGlobalContext();
  const { setDefaultActiveBtn } = useTestContext();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState([]);

  const navigate = useNavigate();

  const handleReadMore = (topic, topicCode) => {
    setSelectedTopic({
      topic,
      topicCode,
      subcode: subject.subjectCode,
    });
    setReadMore(true);
  };

  const handleTest = (topic, topicCode, pdf) => {
    setDefaultActiveBtn(pdf);
    setSubject({
      ...subject,
      selectedTopic: topic,
      selectedTopicCode: topicCode,
    });
    navigate("/TestSeries/Select-Test");
  };

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isRecent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  useEffect(() => {
    const fetchPdf = async (subcode) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://railwaymcq.com/railwaymcq/RailPariksha/getPdfID.php?&subcode=${subcode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch PDF ID");
        }
        const pdfData = await response.json();
        setPdfData(pdfData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPdf(subject.subjectCode);
  }, [subject]);

  return (
    <div
      className="p-2 topDiv "
      style={{
        background: "white",
        maxWidth: "95vw",
        maxHeight: "95vh",
        overflow: "hidden",
        boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
        borderRadius: "10px",
      }}
    >
      <p>subject-{subject.subject}</p>
      <hr />
      {readMore && (
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
          onClick={() => setReadMore(false)}
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
              onClick={() => setReadMore(false)}
            >
              <IoCloseCircleSharp
                style={{
                  color: "red",
                  boxShadow: "5px 5px 10px rgba(0,0,0, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <PdfReader selectedTopic={selectedTopic} />
          </div>
        </div>
      )}
      <div className="row">
        <div
          className="col-4 scrollspy-example-2"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <nav
            id="navbar-example3 topicName"
            className="h-100 flex-column align-items-stretch pe-4 border-end nav-pills"
            style={{ background: "white" }}
          >
            <nav className="nav nav-pills flex-column mt-1">
              {Object.entries(subject?.topics || {}).map(([key, value]) => {
                const isTopicRecent = pdfData.some(
                  (data) =>
                    data.topic === value.topic && isRecent(data.createdOn)
                );

                return (
                  <a
                    style={{ fontSize: "12px" }}
                    key={key}
                    className="btn btn-sm d-flex btn-outline-primary position-relative mb-2 topicBTN"
                    href={`#item-${key}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll(`item-${key}`);
                    }}
                  >
                    {value.topic}{" "}
                    {isTopicRecent && (
                      <span
                        style={{ fontSize: "10px" }}
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger justify-content-center text-center"
                      >
                        New
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </nav>
        </div>

        <div className="col-8">
          <div
            data-bs-spy="scroll"
            data-bs-target="#navbar-example3"
            data-bs-smooth-scroll="true"
            className="scrollspy-example-2"
            tabIndex="0"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {Object.entries(subject?.topics || {}).map(([key, value]) => {
              const isTopicRecent = pdfData.some(
                (data) => data.topic === value.topic && isRecent(data.createdOn)
              );

              return (
                <div id={`item-${key}`} key={key}>
                  <h4 className="topicHead">{value.topic}</h4>
                  <div className="m-2">
                    {loading ? <div>loading...</div> : null}
                    {pdfData
                      .filter((data) => data.topic === value.topic)
                      .map((data, index) => (
                        <div key={index}>
                          {data.notes !== "" ? (
                            <div
                              className="text-start topicData"
                              dangerouslySetInnerHTML={{ __html: data.notes }}
                            />
                          ) : (
                            <strong
                              className="mb-1 topicData"
                              style={{ color: "red" }}
                            >
                              Oops! No notes found
                            </strong>
                          )}
                        </div>
                      ))}
                    {!pdfData.some(
                      (data) =>
                        data.topic === value.topic && data.notes !== null
                    ) && (
                      <strong
                        className="mb-1 topicData"
                        style={{ color: "red" }}
                      >
                        Oops! No notes found
                      </strong>
                    )}
                  </div>

                  <div className="d-flex justify-content-evenly m-1">
                    <button
                      className="btn btn-outline-success position-relative topicBTN "
                      onClick={() => handleReadMore(value.topic, value.topcode)}
                    >
                      <FaFilePdf /> Read more
                      {isTopicRecent && (
                        <span
                          style={{ fontSize: "10px" }}
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger justify-content-center text-center"
                        >
                          New
                        </span>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-danger  topicBTN"
                      onClick={() =>
                        handleTest(value.topic, value.topcode, "PDF")
                      }
                    >
                      <PiExamFill /> Have a test
                    </button>
                  </div>

                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesReader;
