import React from "react";
import HomeTrending from "../components/HomeTrending";
import Department from "../components/Department";
import { useEffect } from "react";
import Slider from "../components/Slider";
import img from "../img/sv3.png";
import TrendingVideos from "../components/Trendings/TrendingVideos";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TrendingCom from "../components/Trendings/TrndingComp";
import TestSeries from "./TestSeries";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { Helmet } from "react-helmet-async";
import BackgroundVideo from "../BackGroundVideo";
import PhotoShowCase from "../components/Discussion/PhotoShowCase";
import PhotoShowCaseForHome from "../components/Discussion/PhotoShowCaseForHome";
import { RiGalleryFill } from "react-icons/ri";
const Home = () => {
  const navigate = useNavigate();
  const { setActivePage, activePage, setSearchKeyWords } = useGlobalContext();
  useEffect(() => {
    setActivePage("home");
  }, [activePage]);
  useEffect(() => {
    fetch("https://railwaymcq.com/railwaymcq/RailPariksha/Visitors_count.php")
      .then((response) => response.text())
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const handleClick = () => {
    navigate("/Feedback");
  };
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <Helmet></Helmet>
      {/*  image for home */}
      <div>
        <Slider />
        <br />
      </div>
      <BackgroundVideo />
      <div className="row mt-3">
        <div className="col-12">
          <TrendingCom from={"home"} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <TestSeries from={"HOME"} />
        </div>
      </div>{" "}
      <div className="row mt-3">
        <div className="col-12">
          <PhotoShowCaseForHome />
        </div>
      </div>{" "}
      <div className="row mt-3">
        <div className="col-12">
          <TrendingVideos from={"home"} />
        </div>
      </div>
    </div>
  );
};
export default Home;
