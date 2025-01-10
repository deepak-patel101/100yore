import React, { lazy, Suspense } from "react";
import GoBackCom from "../GoBackCom";
import { BsFire } from "react-icons/bs";
import BackGroundVideo from "../../BackGroundVideo";

const Cards = lazy(() => import("./Cards"));

const TrendingCom = ({ from }) => {
  return (
    <div className={`container ${from === "home" ? "papaDiv" : ""} `}>
      {from === "home" ? (
        <div className="text-start">
          <h5>
            <BsFire /> Celebrating 100 Years of Railway electrification
          </h5>
        </div>
      ) : (
        <GoBackCom link={"/"} page={"Trending"} />
      )}

      <div
        className={`row ${
          from === "home" ? "" : "papaDiv"
        } mb-3 mt-3 justify-content-center align-item-center text-start`}
      >
        <div className="mb-2">
          {" "}
          "Celebrating a century of Indian Railways, from steam to electric,
          driving the nation forward!"
        </div>
        <div className="col-12 col-md-3 mb-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Cards title={"Video"} TextData={""} />
          </Suspense>
        </div>
        <div className="col-12 col-md-3 mb-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Cards
              title={"Quizzes"}
              TextData={
                "Participates in the quiz event and get a chance to win the price"
              }
            />
          </Suspense>
        </div>
        <div className="col-12 col-md-3 mb-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Cards
              title={"GALLERY"}
              TextData={
                "Explore the Celebration of '100 Years of Railway Electrification "
              }
            />
          </Suspense>
        </div>
        <div className="col-12 col-md-3 mb-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Cards
              title={"LEADERS BOARD"}
              TextData={"check your name in the winner list"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TrendingCom;
