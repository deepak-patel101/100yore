import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../../Context/UserContext";

import YouTubeService from "./YouTubeService";
import { FaSearch } from "react-icons/fa";
import "./feedback.css";
import GoBack from "./comps/GoBack";

const AddVideolinks = () => {
  const { user } = useUserContext();
  const [formData, setFormData] = useState({
    subcode: "",
    topcode: "",
    title: "",
    link: "",
    description: "",
    created_by: user?.name || "",
  });
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [titleAvailability, setTitleAvailability] = useState(true);
  const [linkAvailability, setLinkAvailability] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [linkAvailabilityStatus, setLinkAvailabilityStatus] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (formData.title) {
      checkAvailability("title", formData.title).then(setTitleAvailability);
    }
  }, [formData.title]);

  useEffect(() => {
    if (formData.link) {
      checkAvailability("link", formData.link).then(setLinkAvailability);
    }
  }, [formData.link]);

  useEffect(() => {
    const checkLinksAvailability = async () => {
      if (searchResults.length > 0) {
        const linkStatus = {};
        await Promise.all(
          searchResults.map(async (video) => {
            const videoLink = video.id.videoId;
            const isAvailable = await checkAvailability("link", videoLink);
            linkStatus[videoLink] = isAvailable;
          })
        );
        setLinkAvailabilityStatus(linkStatus);
      }
    };

    checkLinksAvailability();
  }, [searchResults]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/railwaymcq/100YoRE/subMaster_api.php"
      );
      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopcodes = async (subcode) => {
    try {
      const response = await axios.get(
        `https://railwaymcq.com/student/topicMaster_api.php?subcode=${subcode}`
      );
      setTopcodes(response.data);
    } catch (error) {
      console.error(error);
      setTopcodes([]);
    }
  };

  const checkAvailability = async (type, value) => {
    try {
      const response = await axios.post(
        "https://railwaymcq.com/student/check_availabilityTitleLink.php",
        { type, value }
      );
      return response.data.available;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "subcode") {
      fetchTopcodes(value);
    }
  };

  const handleInsert = async () => {
    console.log(formData.subcode);
    console.log(formData.topcode);
    console.log(formData.title);
    console.log(formData.link);
    if (
      !formData.subcode ||
      !formData.topcode ||
      !formData.title ||
      !formData.link ||
      !formData.description
    ) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post(
        "https://railwaymcq.com/railwaymcq/100YoRE/videolinks_api.php",
        formData
      );
      alert("Data inserted successfully!");
      resetForm();
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to insert data!");
    }
  };

  const resetForm = () => {
    setFormData({
      subcode: formData.subcode || "",
      topcode: formData.topcode || "",
      title: "",
      link: "",
      description: "",
      created_by: user?.name || "",
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const results = await YouTubeService.searchVideos(searchQuery);
      setSearchResults(results.items);
      const linkStatus = {};
      await Promise.all(
        results.items.map(async (video) => {
          const videoLink = video.id.videoId;
          const isAvailable = await checkAvailability("link", videoLink);
          linkStatus[videoLink] = isAvailable;
        })
      );
      setLinkAvailabilityStatus(linkStatus);
    } catch (error) {
      console.error("Error searching for videos", error);
    }
  };

  const handleVideoSelect = (video) => {
    const videoLink = video.id.videoId;
    const linkIsAvailable = linkAvailabilityStatus[videoLink];
    setLinkAvailability(linkIsAvailable);
    if (linkIsAvailable) {
      setFormData({
        ...formData,
        title: video.snippet.title,
        link: videoLink,
        description: video.snippet.title,
      });
      setTitleAvailability(true);
    } else {
      alert("Link already exists! Please select another video.");
    }
  };

  return (
    <div className="papaDiv container">
      <GoBack page={"Add New Video"} />

      <form className="m-3 papaDiv">
        <h5
          style={{ margin: "0px", padding: "0px" }}
          className="d-flex text-start"
        >
          {" "}
          Add Video
        </h5>
        <hr />
        <div className="row">
          <div className="col-12 col-md-6 ">
            <p
              style={{ margin: "0px", padding: "0px" }}
              className="d-flex text-start"
            >
              {" "}
              Select Subject
              <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
            </p>
            <select
              className="form-select Subject"
              name="subcode"
              onChange={handleInputChange}
            >
              <option key="default" value="">
                Select Subject
              </option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject.subcode}>
                  {subject.sub}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 ">
            <p
              style={{ margin: "0px", padding: "0px" }}
              className="d-flex text-start"
            >
              {" "}
              Select Topic
              <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
            </p>
            <select
              className="form-select Subject"
              name="topcode"
              value={formData.topcode}
              onChange={handleInputChange}
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
        <p
          style={{ margin: "0px", padding: "0px" }}
          className="d-flex text-start"
        >
          {" "}
          Title of video
          <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
        </p>
        <input
          className="col-12 col-md-12 Subject form-control"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title of video"
        />
        {!titleAvailability ? (
          <p style={{ color: "red" }}>Title already exists!</p>
        ) : (
          <p style={{ color: "green" }}>Title is available!</p>
        )}
        <p
          style={{ margin: "0px", padding: "0px" }}
          className="d-flex text-start"
        >
          {" "}
          Video link
          <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
        </p>

        <input
          className="col-12 col-md-12 Subject form-control"
          type="text"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          placeholder="zdpz01Nccyo"
        />
        {!linkAvailability ? (
          <p style={{ color: "red" }}>Link already exists!</p>
        ) : (
          <p style={{ color: "green" }}>Link is available!</p>
        )}

        <p
          style={{ margin: "0px", padding: "0px" }}
          className="d-flex text-start"
        >
          {" "}
          Description
          <p style={{ color: "red", margin: "0px", padding: "0px" }}> *</p>
        </p>

        <textarea
          className="col-12 col-md-12 Subject form-control"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter your description"
        />
        <input type="hidden" name="created_by" value={user?.name} disabled />
        <button
          className=" btn btn-outline-primary Subject "
          type="button"
          onClick={handleInsert}
        >
          Insert
        </button>
      </form>

      <form className="m-3 papaDiv" onSubmit={handleSearchSubmit}>
        <h5
          style={{ margin: "0px", padding: "0px" }}
          className="d-flex text-start"
        >
          {" "}
          <FaSearch />
          &nbsp; Search video from You Tube
        </h5>
        <div class="input-group ">
          <input
            className="Subject form-control"
            type="text"
            placeholder="Search for YouTube videos"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            style={{ height: "37px" }}
            className=" btn  btn-outline-primary Subject "
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
      {searchResults.length > 0 && (
        <div className="papaDiv m-3">
          <h5>Search Results</h5>
          <ul>
            {searchResults.map((video) => (
              <li
                className="Subject m-3"
                key={video.id.videoId}
                onClick={() => handleVideoSelect(video)}
                style={{
                  background:
                    linkAvailabilityStatus[video.id.videoId] === false
                      ? "linear-gradient(to bottom, white, #B7EDB5)"
                      : linkAvailabilityStatus[video.id.videoId] === true
                      ? "linear-gradient(to bottom, white, #EDB5B5)"
                      : "white",
                  cursor: "pointer",
                }}
              >
                <div className="d-flex justify-item-between">
                  {console.log(video.snippet)}
                  <img
                    className="m-2"
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                  />
                  <div>
                    <p className="m-2">Title: {video.snippet.title}</p>
                    <p className="">Channel : {video.snippet.channelTitle} </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddVideolinks;
