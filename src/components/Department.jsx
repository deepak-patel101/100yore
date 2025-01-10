import React from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import DepartmentCarousel from "./DepartmentCarousel";

const Department = ({ from }) => {
  const { department_loading, departments, department_error } =
    useGlobalContext();
  return (
    <div>
      <DepartmentCarousel departments={departments} from={from} />
      <h1>{department_error}</h1>
    </div>
  );
};
export default Department;
