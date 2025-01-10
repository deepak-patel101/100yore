import React, { useEffect } from "react";
import DiscussMain from "../components/DiscussMain";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { Helmet } from "react-helmet-async";
const YourIdeas = () => {
  const { setActivePage } = useGlobalContext();
  useEffect(() => {
    setActivePage("Gallery");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <Helmet>
        <title>100 years of railway electrification</title>
        <meta
          name="description"
          content="Join the MCQ Town discussion forum to connect with others, ask questions, and share knowledge."
        />
        <meta
          name="keywords"
          content="discussion forum, MCQ chat, exam preparation forum, study discussions, question and answer, community support"
        />
        <meta property="og:title" content="MCQ Town | Discussion Forum" />
        <meta
          property="og:description"
          content="Connect with others on MCQ Town to discuss exam topics, share knowledge, and ask questions on a wide range of subjects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/discussion" />
        <meta
          property="og:image"
          content="https://yourwebsite.com/images/discussion-thumbnail.jpg"
        />
      </Helmet>
      <p>
        <h3>"Welcome to the Gallery of Legacy and Progress!" </h3> <br />
        Step into a visual and emotional journey celebrating the incredible
        evolution of Indian Railways.
        <br />
      </p>
      <DiscussMain />{" "}
    </div>
  );
};
export default YourIdeas;
