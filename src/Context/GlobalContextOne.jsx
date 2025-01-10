import React, {
  useEffect,
  useReducer,
  useContext,
  createContext,
  useState,
} from "react";
import GlobalReducer from "../Reducer/GlobalReducerOne"; // adjust the path as needed
import { useUserContext } from "./UserContext";
const initialState = {
  department_loading: false,
  zone_division_loading: false,
  notes: null,
  notes_loading: false,
  notes_error: false,
  departments: null,
  selected: null,
  SearchKeyWord: null,
  zone_division: null,
  activePage: null,
  depot_loding: false,
  depots: null,
  depot_error: false,
  subject: {
    department: null,
    departmentCode: null,
    subject: null,
    subjectCode: null,
    topics: null,
    selectedTopic: null,
    selectedTopicCode: null,
    queFrom: null,
  },
  department_error: false,
  zone_division_error: false,
  videoData: null,
  allVideos: null,
  thread: null,
  selectedThread: null,
  threadControl: {
    feed: true,
    explore: "",
    search: "",
    trending: null,
  },
};

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);
  const { user } = useUserContext();
  const [userId, setUserId] = useState(3);
  useEffect(() => {
    setUserId(user?.id);
  }, [user]);
  const fetchMastInfo = async () => {
    dispatch({ type: "GET_SUBJECT_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/100YoRE/Department.php`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Check if the response is valid JSON
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        dispatch({ type: "GET_SUBJECT_MASTER_INFO_SUCCESS", payload: data });
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Invalid JSON response from server");
      }
    } catch (error) {
      console.error("Error fetching SUBJECT_MASTER info:", error);
      dispatch({ type: "GET_SUBJECT_MASTER_INFO_ERROR" });
    }
  };

  const fetchZoneDivesion = async () => {
    dispatch({ type: "GET_ZONE_DIVISION_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        "https://railwaymcq.com/ohe/zone_division_api.php"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({ type: "GET_ZONE_DIVISION_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching ZONE_DIVISION info:", error);
      dispatch({ type: "GET_ZONE_DIVISION_INFO_ERROR" });
    }
  };
  const fetchDepot = async () => {
    dispatch({ type: "GET_DEPOT_MASTER_INFO_BEGIN" });
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/100YoRE/Depot_info.php"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({ type: "GET_DEPOT_INFO_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching ZONE_DIVISION info:", error);
      dispatch({ type: "GET_DEPOT_INFO_ERROR" });
    }
  };

  useEffect(() => {
    fetchMastInfo();
    fetchZoneDivesion();
    fetchDepot();
  }, [userId]);
  const setSubject = (data) => {
    dispatch({ type: "SET_SUBJECT", payload: data });
  };
  const setZoneDivision = (data) => {
    dispatch({ type: "SET_ZONE_DIVISION", payload: data });
  };

  const fetchNote = async () => {
    dispatch({ type: "GET_NOTES_BEGIN" });
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/RailPariksha/getPdfID.php`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch PDF ID");
      }
      const data = await response.json();
      dispatch({ type: "GET_NOTES_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "GET_NOTES_ERROR" });
    }
  };

  const setThreadData = (data) => {
    dispatch({ type: "SET_THREAD_DATA", payload: data });
  };
  const setActivePage = (page) => {
    dispatch({ type: "ACTIVE_PAGE", payload: page });
  };
  useEffect(() => {
    fetchNote();
  }, []);
  const setVideoData = (vData) => {
    dispatch({ type: "SET_VIDEO_DATA", payload: vData });
  };
  const setThreadControlData = (data) => {
    dispatch({ type: "SET_THREAD_CONTROL_DATA", payload: data });
  };
  const setSelectedInfo = (data) => {
    dispatch({ type: "SET_SELECTED_BTN", payload: data });
  };

  const setSearchKeyWords = (data) => {
    dispatch({ type: "SET_SEARCH_KEYWORD", payload: data });
  };
  return (
    <GlobalContext.Provider
      value={{
        ...state,
        fetchMastInfo,
        setSearchKeyWords,
        fetchZoneDivesion,
        setSelectedInfo,
        setZoneDivision,
        setSubject,
        fetchNote,
        setThreadData,
        setVideoData,
        setThreadControlData,
        setActivePage,
        fetchDepot,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export { GlobalContext };
