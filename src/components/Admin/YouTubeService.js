import axios from "axios";

const API_KEY = "AIzaSyBv5rWqjn6fNRLBJ3szYDN1u7FlVdUKweA"; //DP
// const API_KEY = "AIzaSyACKPne_HnHQbgl7gPyIFpwDqHi2Z6bBxM"; //OP
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const searchVideos = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for videos", error);
    throw error;
  }
};

const getVideoDetails = async (videoId) => {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching video details", error);
    throw error;
  }
};

export default {
  searchVideos,
  getVideoDetails,
};
