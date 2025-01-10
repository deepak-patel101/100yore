import React, { useState, useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

const PdfReader = ({ selectedTopic }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pdfIdError, setPdfIdError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      setProgress(0);
      try {
        const response = await fetch(
          `https://railwaymcq.com/railwaymcq/RailPariksha/getPdfID.php?topcode=${selectedTopic.topicCode}&subcode=${selectedTopic.subcode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch PDF ID");
        }
        const pdfData = await response.json();
        const pdf_id = pdfData[0]?.id;
        if (pdf_id === null || pdf_id === "Undefined") {
          setPdfIdError(true);
          setErrorMessage("Oops! PDF not found.");
          setPdfUrl(null);
        } else {
          setPdfIdError(false);
          const pdfResponse = await fetch(
            `https://railwaymcq.com/railwaymcq/RailPariksha/getPDF.php?pdf_id=${pdf_id}`
          );
          if (!pdfResponse.ok) {
            throw new Error("Failed to fetch PDF");
          }

          const reader = pdfResponse.body.getReader();
          let receivedLength = 0;
          const chunks = [];
          let totalLength = 0;

          // Get total length of PDF dynamically
          const contentLengthHeader = pdfResponse.headers.get("caller");
          if (contentLengthHeader) {
            totalLength = parseInt(contentLengthHeader, 10);
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;

            // Estimate progress based on received length relative to total length
            if (totalLength > 0) {
              setProgress(Math.round((receivedLength / totalLength) * 100));
            } else {
              // If total length is unknown, estimate progress without total length
              setProgress(
                Math.round(
                  (receivedLength / (receivedLength + 1024 * 1024)) * 100
                )
              ); // Assuming a max file size of 1MB for estimation
            }
          }

          const blob = new Blob(chunks);
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      } catch (error) {
        setPdfIdError(true);
        setErrorMessage("Oops! Failed to load PDF.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedTopic) {
      fetchPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [selectedTopic]);

  useEffect(() => {
    const handleResize = () => {
      setIsFullscreen(window.innerWidth < 580);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div
      className="container"
      style={{
        margin: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "100vh",
      }}
    >
      {loading && (
        <div>
          <div
            style={{
              background: "white",
              padding: "20px",
            }}
          >
            <h6>Loading... please wait </h6>
            <div
              style={{ width: "200px" }}
              className="progress"
              role="progressbar"
              aria-label="Animated striped example"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {pdfIdError && (
        <div>
          <div
            style={{
              background: "white",
            }}
          >
            <h6>{errorMessage}</h6>
          </div>
        </div>
      )}
      {!pdfIdError && !loading && pdfUrl && (
        <div
          className="pdf-container"
          style={{
            width: isFullscreen ? "90vw" : "90vw",
            height: isFullscreen ? "90vh" : "90vh",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PdfReader;
{
}
