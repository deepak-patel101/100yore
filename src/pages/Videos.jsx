import React, { useEffect } from "react";
import VideoLearner from "../components/VideoLearner";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { Helmet } from "react-helmet-async";

const Videos = () => {
  const { setActivePage } = useGlobalContext();

  useEffect(() => {
    setActivePage("video");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <Helmet>
        <title>
          {" "}
          100 years of railway electrification | Educational Videos for Exam
          Preparation
        </title>
        <meta
          name="description"
          content="Watch educational videos to deepen your understanding of topics like Math, Science, and more."
        />
        <link rel="canonical" href="https://mcqtown.com/Videos" />
        <meta
          name="keywords"
          content="educational videos, exam preparation, video tutorials, MCQ help"
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
        <meta property="og:url" content="https://mcqtown.com/Videos" />
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

      <VideoLearner />
    </div>
  );
};

export default Videos;
