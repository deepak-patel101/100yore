import React from "react";
import { useEffect } from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import Department from "../components/Department";
import TrendingTest from "../components/TrendingTest";
import { Helmet } from "react-helmet-async";
const Exam = ({ from }) => {
  const { subject, setActivePage, setSearchKeyWords } = useGlobalContext();
  useEffect(() => {
    setActivePage("TestSeries");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div
      className="container text-center mt-12"
      style={{ minHeight: from === "HOME" ? null : "90vh" }}
    >
      <Department from={from} />
    </div>
  );
};
export default Exam;
