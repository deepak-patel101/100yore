import React from "react";
const FileUploadResult = ({ resultData }) => {
  return (
    <div
      className="scrollspy-example-2"
      style={{
        maxHeight: "80vh",
        maxWidth: "80vw",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="row   ">
        <div className="col-12 col-md-6">
          <div className="m-1 Subject border border-success">
            <div className="">
              {" "}
              <h6
                className="m-1 d-flex align-items-center justify-content-center"
                style={{
                  height: "30px",
                  background: "#58a047",
                  color: "white",
                }}
              >
                {resultData?.inserted?.length} Questions Inserted
              </h6>
              <div
                className="m-1 ps-1 pe-1 border border-success text-start"
                style={{
                  minHeight: "200px",
                  minWidth: "350px",
                }}
              >
                {resultData?.inserted?.map((question, index) => {
                  return (
                    <div key={index}>
                      <div className="col-12">
                        Q. {index + 1} - {question}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6  ">
          <div className="m-1 Subject border border-danger">
            <div className="">
              {" "}
              <h6
                className="m-1 d-flex align-items-center justify-content-center"
                style={{
                  height: "30px",
                  background: "#de483c",
                  color: "white",
                }}
              >
                {" "}
                {resultData?.skipped?.length} Questions allrady exist
              </h6>
              <div
                className="m-1 ps-1 pe-1 border border-danger text-start"
                style={{
                  minHeight: "200px",
                  minWidth: "350px",
                }}
              >
                {resultData?.skipped?.map((question, index) => {
                  return (
                    <div key={index}>
                      <div className="col-12">
                        Q. {index + 1} - {question}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FileUploadResult;
