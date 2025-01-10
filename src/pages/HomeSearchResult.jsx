import React from "react";
import { useGlobalContext } from "../Context/GlobalContextOne";
import HomeSearchedVideo from "../components/HomeSearchedVideo";
import SearchedDepartment from "../components/SearchedDepartemet";
import SelectTestToDo from "../components/SelectTestToDo";
import EasyTest from "../components/EasyTest";
import HardTest from "../components/HardTest";
import ModerateTest from "../components/ModerateTest";
import MarathonTest from "../components/MarathonTest";
import RandomTest from "../components/Randomtest";
import ToughTest from "../components/ToughTest";
import { MdQuickreply } from "react-icons/md";
import { Helmet } from "react-helmet-async";

const HomeSearchResult = () => {
  const { SearchKeyWord } = useGlobalContext();
  // console.log(SearchKeyWord);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <Helmet>
        <title>Search Results | MCQ Town</title>
        <meta
          name="description"
          content="Find multiple-choice questions (MCQs) across various topics including Math, General Knowledge, Science, Engineering, Law, and more. Prepare for exams and quizzes with MCQ Town's extensive MCQ library."
        />
        <link rel="canonical" href="https://mcqtown.com/Home/Search-Result" />
        <meta
          name="title"
          content="Search Results | Find Free Multiple Choice Questions Across All Topics on MCQ Town"
        />
        <meta
          name="keywords"
          content="MCQ search, MCQ results, online quizzes, free MCQs, exam preparation, competitive exams, school quizzes, General Knowledge MCQs, science MCQs, math MCQs, search all topics"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Search Results on MCQ Town | Explore Free MCQs Across All Topics"
        />
        <meta
          property="og:description"
          content="Search for multiple-choice questions (MCQs) across Math, Science, GK, Engineering, Law, and more. Get instant access to a wide selection of free MCQs for exam preparation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcqtown.com/Search-Result" />
        <meta
          property="og:image"
          content="https://mcqtown.com/images/search-thumbnail.jpg"
        />
      </Helmet>

      <div className="row mt-3">
        <div className="col-12">
          <HomeSearchedVideo />
        </div>
      </div>
      <div className="row mt-3 papaDiv">
        <div className="col-12">
          <SearchedDepartment from={"search"} />
        </div>
      </div>
      <div className="row mt-3 papaDiv">
        <div className="col-12">
          <div className="text-start">
            <h5>
              <MdQuickreply /> Have a quick test
            </h5>
            <br />
          </div>{" "}
          <EasyTest from={"search"} />
          <ModerateTest from={"search"} />
          <ToughTest from={"search"} />
          <RandomTest from={"search"} />
          <MarathonTest from={"search"} />
        </div>
      </div>
    </div>
  );
};
export default HomeSearchResult;
