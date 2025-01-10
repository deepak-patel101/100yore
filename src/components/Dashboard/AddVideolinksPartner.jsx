import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../../Context/UserContext";
import { FaSearch } from "react-icons/fa";

const AddVideolinksPartner = () => {
  const { user } = useUserContext();

  // const YOUTUBE_API_KEY = adminloginData?.userData?.API;
  const YOUTUBE_API_KEY = "AIzaSyBv5rWqjn6fNRLBJ3szYDN1u7FlVdUKweA"; //DP
  const CHANNEL_ID = user?.CH_ID; // Replace with the desired channel ID

  const [formData, setFormData] = useState({
    subcode: "",
    topcode: "",
    title: "",
    link: "",
    description: "",
    created_by: user?.name || "",
    partner_flag: "1",
  });
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [titleAvailability, setTitleAvailability] = useState(true);
  const [linkAvailability, setLinkAvailability] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [linkAvailabilityStatus, setLinkAvailabilityStatus] = useState({});
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchSubjects();
    fetchPlaylists();
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
        "https://railwaymcq.com/student/subMaster_api.php"
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
        "https://railwaymcq.com/student/videolinkspartener_api.php",
        formData
      );
      console.log(formData);
      alert("Data inserted successfully!");
      resetForm();
      // console.log(response.data);
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
      partner_flag: "1",
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const results = await searchVideos(searchQuery);
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

  const searchVideos = async (query) => {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
    );
    return response.data;
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=25&key=${YOUTUBE_API_KEY}`
      );
      setPlaylists(response.data.items);
    } catch (error) {
      console.error("Error fetching playlists", error);
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
    <div className="papaDiv">
      <form>
        <div className="row">
          <div className="col-12 col-md-6">
            {" "}
            <select
              name="subcode"
              className="form-select Subject"
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
          <div className="col-12 col-md-6">
            {" "}
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

        <input
          className="form-control Subject"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title of video"
        />
        {formData.title === "" ? null : !titleAvailability ? (
          <p style={{ color: "red" }}>Title already exists!</p>
        ) : (
          <p style={{ color: "green" }}>Title is available!</p>
        )}
        <input
          className="form-control Subject"
          type="text"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          placeholder="Enter your link like zdpz01Nccyo"
        />
        {formData.link === "" ? null : !linkAvailability ? (
          <p style={{ color: "red" }}>Link already exists!</p>
        ) : (
          <p style={{ color: "green" }}>Link is available!</p>
        )}
        {}
        <textarea
          className="form-control Subject"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter your description"
        />
        <input type="hidden" name="created_by" value={user?.name} disabled />
        <button
          type="button"
          className="btn btn-outline-success Subject"
          onClick={handleInsert}
        >
          Insert
        </button>
      </form>

      <form onSubmit={handleSearchSubmit}>
        <div className="row">
          <div className="col-12 col-md-9">
            {" "}
            <input
              type="text"
              className="form-control Subject"
              placeholder="Search for YouTube videos"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-12 col-md-3">
            <div className="row me-2">
              {" "}
              <button
                className="btn btn-outline-secondary Subject"
                type="submit"
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
        </div>
      </form>

      {playlists.length > 0 && (
        <div>
          <h2>Channel Playlists</h2>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <h3>{playlist.snippet.title}</h3>
                <p>{playlist.snippet.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((video) => (
              <li
                key={video.id.videoId}
                onClick={() => handleVideoSelect(video)}
                style={{
                  backgroundColor:
                    linkAvailabilityStatus[video.id.videoId] === false
                      ? "indianred"
                      : linkAvailabilityStatus[video.id.videoId] === true
                      ? "palegreen"
                      : "white",
                  cursor: "pointer",
                }}
              >
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                />
                <p>{video.snippet.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddVideolinksPartner;
