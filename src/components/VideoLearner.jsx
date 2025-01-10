import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useUserContext } from "../Context/UserContext.jsx";
import Loading from "./Loading.jsx";
import VideoSearchView from "./VideoSearchView.jsx";
import VideoHomeView from "./VideoHomeView.jsx";
import { useGlobalContext } from "../Context/GlobalContextOne.jsx";
import GoBackCom from "./GoBackCom.jsx";

const VideoLearner = () => {
  const { setVideoData, allVideos: videos } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopcode, setSelectedTopcode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 16;
  const { user } = useUserContext();
  const [paginationDisabled, setPaginationDisabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, subjectRes] = await Promise.all([
          axios.get(
            "https://railwaymcq.com/railwaymcq/100YoRE/videolinks_api.php"
          ),
          axios.get(
            "https://railwaymcq.com/railwaymcq/100YoRE/subMaster_api.php"
          ),
        ]);
        setVideoData({ allVideos: videoRes.data });
        setSubjects(subjectRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubjectChange = async (e) => {
    const selectedSubcode = e.target.value;
    setSelectedSubject(selectedSubcode);
    try {
      const response = await axios.get(
        `https://railwaymcq.com/student/topicMaster_api.php?subcode=${selectedSubcode}`
      );
      setTopcodes(response.data);
    } catch (error) {
      console.error(error);
      setTopcodes([]);
    }
  };

  const handleTopcodeChange = (e) => {
    setSelectedTopcode(e.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterVideos = () => {
    if (selectedTopcode === "" && searchQuery === "") {
      setFilteredVideos([]);
      return;
    }
    const filtered = videos.filter((video) => {
      return (
        (searchQuery === "" ||
          video.id.toString().includes(searchQuery) ||
          video.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedSubject === "" ||
          video.subcode.toString() === selectedSubject) &&
        (selectedTopcode === "" || video.topcode.toString() === selectedTopcode)
      );
    });
    setFilteredVideos(filtered);
  };

  useEffect(() => {
    filterVideos();
    setCurrentPage(1);
  }, [searchQuery, videos, selectedSubject, selectedTopcode]);

  const groupedBySub = videos?.reduce((acc, obj) => {
    const { sub } = obj;
    if (!acc[sub]) {
      acc[sub] = [];
    }
    acc[sub].push(obj);
    return acc;
  }, {});

  const groupedBySubWithViews = Object.keys(groupedBySub || {}).map((sub) => ({
    sub,
    totalViews: groupedBySub[sub]?.reduce((total, obj) => total + obj.views, 0),
    items: groupedBySub[sub]?.sort((a, b) => b.views - a.views),
  }));

  const sortedByViews = groupedBySubWithViews?.sort(
    (a, b) => b.totalViews - a.totalViews
  );

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setPaginationDisabled(loading);
  }, [loading]);

  return (
    <div>
      {/* Uncomment this code when we have video data */}
      <div className="row papaDiv">
        <div className="col-12 col-md-6">
          <div className="row d-flex">
            <h6 className="text-start ">
              <FaSearch /> Search
            </h6>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control Subject"
            />
          </div>
        </div>
        {/* <div div className="col-12 col-md-6 ">
          <h6 className="text-start">
            <FaFilter /> Filter by Subject and Topic
          </h6>
          <div className="row">
            {" "}
            <div className="col-12 col-md-6">
              <select
                name="subcode"
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="form-select Subject"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subcode} value={subject.subcode}>
                    {subject.sub}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <select
                name="topcode"
                value={selectedTopcode}
                onChange={handleTopcodeChange}
                className="form-select Subject"
              >
                <option value="">Select Topic</option>
                {topcodes.map((topcode) => (
                  <option key={topcode.topcode} value={topcode.topcode}>
                    {topcode.topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div> */}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {selectedTopcode === "" && searchQuery === "" ? (
            <VideoHomeView sortedByViews={sortedByViews} />
          ) : (
            <VideoSearchView
              currentVideos={currentVideos}
              filteredVideos={filteredVideos}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoLearner;
