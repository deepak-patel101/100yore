import React from "react";
import html2pdf from "html2pdf.js";
import logo from "../../img/logo.png";
import "./ExportPDF.css";
import { FaDownload } from "react-icons/fa";

const ExportToPDF = ({ data }) => {
  const generatePDF = () => {
    const element = document.getElementById("pdf-content");

    const options = {
      margin: [10, 10], // Set margins (top/bottom, left/right)
      filename: `${data[0]}-(MCQTown.com).pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // A4 size
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // Ensure proper page breaks
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div>
      <div
        style={{ maxHeight: "80vh", maxWidth: "80vw", overflow: "auto" }}
        className="scrollspy-example-2"
      >
        <div id="pdf-content" style={{ fontSize: "12px" }}>
          <div className=" d-flex justify-content-between">
            <div className="">
              <a href="https://mcqtown.com/">
                <div className="d-flex">
                  <img src={logo} alt="logo" style={{ height: "20px" }} />
                  MCQTown.com
                </div>
              </a>
            </div>
            <div></div>
            <div>set-{data[0]}</div>
          </div>
          <div className="text-center">
            <h4>
              <img src={logo} alt="logo" style={{ height: "30px" }} /> MCQTown
            </h4>
            <h5>
              Visit <a href="https://mcqtown.com/">mcqtown.com</a> for more
              papers
            </h5>
          </div>
          <div className="d-flex justify-content-between">
            <div>Questions {data[1]?.length}</div>
            <div>Time {data[1]?.length} Minutes</div>
          </div>
          <hr />

          {/* 2x2 Grid layout */}
          <div className="question-grid  " style={{}}>
            {data[1]?.map((test, ind) => {
              return (
                <div
                  key={test?.qcode}
                  className="grid-item ps-2 pe-2 "
                  style={{
                    pageBreakInside: "avoid", // Prevent splitting across pages
                    overflow: "hidden", // Prevents overflow of content
                    display: "flex", // Allows flexible item management
                    flexDirection: "column", // Aligns items vertically
                  }}
                >
                  <h5 style={{ margin: 0 }}>
                    {ind + 1}. {test?.question}
                  </h5>
                  <div>
                    <ol className="ms-2" type="A">
                      {test?.options.map((option, index) => (
                        <li key={index} style={{ margin: 0 }}>
                          {option}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <div></div>
            <div className="d-flex">
              {" "}
              <img src={logo} alt="logo" style={{ height: "30px" }} />
              <h4>MCQTown.com</h4>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="text-end">
        <button className="btn btn-outline-primary " onClick={generatePDF}>
          <FaDownload /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default ExportToPDF;
