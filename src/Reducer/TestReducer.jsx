import { act } from "react-dom/test-utils";

const TestReducer = (state, action) => {
  switch (action.type) {
    case "GET_TEST_MASTER_INFO_BEGIN":
      return {
        ...state,

        test_loading: true,
      };
    case "GET_TEST_MASTER_INFO_SUCCESS":
      return {
        ...state,
        test_loading: false,
        test_data: action.payload,
      };
    case "GET_TEST_MASTER_INFO_ERROR":
      return {
        ...state,
        test_loading: false,
        test_error: true,
      };
    case "GET_ONGOING_TEST_MASTER_INFO_BEGIN":
      return {
        ...state,
        test_ongoing_loading: true,
      };
    case "GET_ONGOING_TEST_MASTER_INFO_SUCCESS":
      return {
        ...state,
        test_ongoing_loading: false,
        test_ongoing_data: action.payload,
      };
    case "GET_TEST_MASTER_INFO_ERROR":
      return {
        ...state,
        test_ongoing_loading: false,
        test_ongoing_error: true,
      };
    case "SET_TEMP_TEST_DATA":
      return {
        ...state,
        temp_test_data: action.payload,
      };
    case "SET_ACTIVE_BTN_FOR_TEST_LIST":
      return {
        ...state,
        defaultActiveBtn: action.payload,
      };
    case "SET_START_TEST":
      const data = action.payload;
      return {
        ...state,
        start_Test: {
          test: data.set,
          timing: data.timing,
          activeQuestion: 0,
        },
        userResponse: {
          testAnswer: {},
        },
        countDown: {
          testTiming: null,
          timeTaken: null,
          remainingTime: null,
        },
      };

    case "UPDATE_ACTIVE_QUESTION":
      return {
        ...state,
        start_Test: {
          ...state.start_Test,
          activeQuestion: action.payload,
        },
      };
    case "UPDATE_ACTIVE_QUESTION_Status":
      const question =
        state.start_Test.activeQuestion === "undefined"
          ? 0
          : state.start_Test.activeQuestion;
      return {
        ...state,
        start_Test: {
          ...state.start_Test,
          test: {
            ...state.start_Test.test,
            [question]: {
              ...state.start_Test.test[question],
              activeQuestionStatus: action.payload,
            },
          },
        },
      };
    case "UPDATE_USER_RESPONSE":
      const questionNo =
        state.start_Test.activeQuestion === "undefined"
          ? 0
          : state.start_Test.test[state.start_Test.activeQuestion]?.qcode;
      return {
        ...state,
        userResponse: {
          ...state.userResponse,
          testAnswer: {
            ...state.userResponse.testAnswer,
            [questionNo]: {
              ...state.userResponse.testAnswer[questionNo],
              answer: action?.payload?.answer,
              timeTaken: action?.payload?.timeTaken,
              qStatus: action?.payload?.qStatus,
            },
          },
        },
      };
    case "UPDATE_COUNTDOWN_TIMER":
      return {
        ...state,
        countDown: {
          testTiming: action.payload.testTiming,
          timeTaken: action.payload.timeTaken,
          remainingTime: action.payload.remainingTime,
        },
      };
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default TestReducer;
