import React, { useEffect, useState, useCallback, useRef } from "react";
import InspectionNote from "../components/InspectionNote";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { Helmet } from "react-helmet-async";
const AddNotes = () => {
  const { setActivePage } = useGlobalContext();
  useEffect(() => {
    setActivePage("Notification");
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  return (
    <div className="container text-center mt-12" style={{ minHeight: "90vh" }}>
      <Helmet>
        <title>
          Add Study Notes | MCQ Town - Organize Your Exam Preparation
        </title>
        <meta
          name="description"
          content="Easily add and organize your study notes with MCQ Town. Keep track of important topics, explanations, and resources to enhance your exam preparation."
        />
        <link rel="canonical" href="https://mcqtown.com/Add-Notes" />
        <meta
          name="title"
          content="Add Study Notes | MCQ Town - Personalized Exam Prep Notes"
        />
        <meta
          name="keywords"
          content="add notes, study notes, exam preparation notes, personal notes, MCQ notes, study organization, track topics, MCQ Town"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags for social media */}
        <meta property="og:title" content="Add Study Notes | MCQ Town" />
        <meta
          property="og:description"
          content="Organize your study notes with MCQ Town. Keep track of key topics, explanations, and resources to support your exam preparation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcqtown.com/add-note" />
        <meta
          property="og:image"
          content="https://mcqtown.com/images/add-note-thumbnail.jpg"
        />

        {/* Twitter card for Twitter sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Add Study Notes | MCQ Town" />
        <meta
          name="twitter:description"
          content="Easily add and organize study notes on MCQ Town to enhance your exam preparation. Track key topics and resources in one place."
        />
        <meta
          name="twitter:image"
          content="https://mcqtown.com/images/add-note-thumbnail.jpg"
        />
      </Helmet>
      <h6> Create and Organize Your Notes at MCQ Town</h6>
      <InspectionNote />
      <p>
        Learning made personal! With our Custom Notes Page, you can create,
        save, and organize your own study notes effortlessly. Whether you’re
        preparing for exams, keeping track of important concepts, or summarizing
        key points, our notes feature is here to help.
        <h6 className="text-start" style={{ color: "red" }}>
          Why Use the Custom Notes Feature?
        </h6>
        <ul className="text-start">
          <li>
            <h6>Personalized Learning:</h6> Tailor your notes to suit your study
            style and needs.
          </li>
          <li>
            <h6>Easy Access:</h6> Create and store notes in one place for quick
            retrieval.
          </li>
          <li>
            <h6>Seamless Organization:</h6> Categorize and sort your notes by
            topic or subject.
          </li>
          <li>
            <h6>
              {" "}
              The Custom Notes Page is perfect for students, professionals, and
              lifelong learners who want to stay organized and efficient.
              Combine it with our MCQs, trending discussions, and videos to
              create a comprehensive learning experience. Start creating your
              notes today and take control of your learning journey with MCQ
              Town!
            </h6>
          </li>
        </ul>
      </p>
    </div>
  );
};

export default AddNotes;
