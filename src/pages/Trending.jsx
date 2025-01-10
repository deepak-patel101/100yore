import React, { useEffect } from "react";
import TrendingCom from "../components/Trendings/TrndingComp";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { Helmet } from "react-helmet-async";
const Trending = () => {
  const { setActivePage } = useGlobalContext();
  useEffect(() => {
    setActivePage("trending");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <Helmet>
        <title>Trending MCQs | MCQ Town - Most Popular Questions</title>
        <meta
          name="description"
          content="Discover the trending multiple-choice questions on MCQ Town. Explore popular topics and frequently attempted questions to stay updated and prepare effectively for exams."
        />
        <link rel="canonical" href="https://mcqtown.com/Trending" />
        <meta
          name="title"
          content="Trending MCQs | MCQ Town - Popular Topics for Exam Preparation"
        />
        <meta
          name="keywords"
          content="trending MCQs, popular MCQs, exam preparation, top questions, popular topics, frequently attempted questions, competitive exam preparation, study resources"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags for social media */}
        <meta
          property="og:title"
          content="Trending MCQs | MCQ Town - Popular Questions"
        />
        <meta
          property="og:description"
          content="Stay up-to-date with trending MCQs on MCQ Town. Find popular questions to enhance your knowledge and prepare effectively."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcqtown.com/trending" />
        <meta
          property="og:image"
          content="https://mcqtown.com/images/trending-thumbnail.jpg"
        />

        {/* Twitter card for Twitter sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trending MCQs | MCQ Town" />
        <meta
          name="twitter:description"
          content="Explore trending MCQs on MCQ Town. Stay updated with popular questions and topics for your exam preparation."
        />
        <meta
          name="twitter:image"
          content="https://mcqtown.com/images/trending-thumbnail.jpg"
        />
      </Helmet>
      <h5>Explore What’s Trending at MCQ Town</h5>
      <TrendingCom />
      <p className="test-start ms-5 me-5">
        {" "}
        <ul className="text-start">
          <li>
            {" "}
            <h6 className="d-flex">TEST:</h6> Challenge yourself with the most
            attempted and highly-rated quizzes. These tests cover various
            topics, from academics to competitive exams, helping you assess and
            improve your knowledge. <br />
          </li>
          <li>
            {" "}
            <h6 className="d-flex">VIDEO:</h6> Learn on the go with our trending
            video lessons and tutorials. Visual learning has never been this
            easy or engaging! <br />
          </li>
          <li>
            <h6 className="d-flex">Discussion:</h6> Join lively discussions on
            trending topics. Share your insights, clear your doubts, and connect
            with a community of enthusiastic learners. <br />
          </li>
          <li>
            <h6 className="d-flex">Leaderboard: </h6>See who’s leading the pack!
            Track the top performers and get inspired to secure your place at
            the top of the leaderboard.
          </li>
          <li>
            Whether you’re here to test your skills, watch engaging videos,
            participate in discussions, or climb the leaderboard, the Trending
            Section at MCQ Town is your go-to destination for dynamic learning
            and interaction.
          </li>
        </ul>
        <h5>
          Discover. Engage. Succeed. Explore our trending content now and join
          thousands of learners who are making strides every day!
        </h5>
      </p>
    </div>
  );
};
export default Trending;
