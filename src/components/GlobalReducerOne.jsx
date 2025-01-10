import Department from "../components/Department";

const GlobalReducer = (state, action) => {
  switch (action.type) {
    case "GET_SUBJECT_MASTER_INFO_BEGIN":
      return {
        ...state,

        department_loading: true,
      };
    case "GET_SUBJECT_MASTER_INFO_SUCCESS":
      return {
        ...state,
        department_loading: false,
        departments: action.payload,
      };
    case "GET_SUBJECT_MASTER_INFO_ERROR":
      return {
        ...state,
        department_loading: false,
        department_error: true,
      };

    //zone division
    case "GET_ZONE_DIVISION_MASTER_INFO_BEGIN":
      return {
        ...state,

        zone_division_loading: true,
      };
    case "GET_ZONE_DIVISION_INFO_SUCCESS":
      return {
        ...state,
        zone_division_loading: false,
        zone_division: action.payload,
      };
    case "GET_ZONE_DIVISION_INFO_ERROR":
      return {
        ...state,
        zone_division_loading: false,
        zone_division_error: true,
      };
    //end of zone division
    case "GET_NOTES_BEGIN":
      return {
        ...state,

        notes_loading: true,
      };
    case "GET_NOTES_SUCCESS":
      return {
        ...state,
        notes_loading: false,
        notes: action.payload,
      };
    case "GET_NOTES_ERROR":
      return {
        ...state,
        notes_loading: false,
        notes_error: true,
      };
    case "SET_SUBJECT":
      const subObj = action.payload;
      return {
        ...state,
        subject: {
          department: subObj.department,
          departmentCode: subObj.departmentCode,
          subject: subObj.subject,
          queFrom: subObj.queFrom,
          subjectCode: subObj.subjectCode,
          topics: subObj.topics,
          selectedTopic: subObj.selectedTopic,
          selectedTopicCode: subObj.selectedTopicCode,
        },
      };
    case "SET_ZONE_DIVISION":
      const zone_division = action.payload;
      return {
        ...state,
        subject: {
          zone: zone_division.zone,
          division: zone_division.division,
        },
      };
    case "SET_THREAD_DATA":
      return {
        ...state,
        thread: action.payload.thread || state.thread,
        selectedThread: action.payload.selectedThread || state.selectedThread,
      };
    case "SET_VIDEO_DATA":
      return {
        ...state,
        allVideos: action.payload.allVideos || state.allVideos,
        videoData: action.payload.videoData || state.videoData,
      };
    case "SET_THREAD_CONTROL_DATA":
      return {
        ...state,
        threadControl: {
          ...state.threadControl, // Spread existing threadControl state
          feed:
            action.payload.feed !== undefined
              ? action.payload.feed
              : state.threadControl.feed,
          explore:
            action.payload.explore !== undefined
              ? action.payload.explore
              : state.threadControl.explore,
          search:
            action.payload.search !== undefined
              ? action.payload.search
              : state.threadControl.search,
          trending:
            action.payload.trending !== undefined
              ? action.payload.trending
              : state.threadControl.trending,
        },
      };

    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default GlobalReducer;
