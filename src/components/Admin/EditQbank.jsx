import React from "react";
import EditableQbankData from "./EditableQbankData";
import GoBack from "./comps/GoBack";
const EditQbank = () => {
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <GoBack page={"Edit Q-Bank"} />
      <EditableQbankData />
    </div>
  );
};
export default EditQbank;
