import React, { useEffect, useReducer, useContext } from "react";
import reducer from "../Reducer/Initial_reducer";

const initialState = {
  railwayInfo: {
    railway_zone: "WCR",
    railway_division: "Jabalpur",
    railway_depot: "",
  },
  zoneAndDivisionData: null,
  zoneAndDivisionLoading: false,
  zoneAndDivisionError: false,
};

const InitialContext = React.createContext();

export const InitialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const zoneAndDivisionInfoToFetch = async () => {
    dispatch({ type: "GET_ZONE_AND_DIVISION_INFO_BEGIN" });
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/100YoRE/zone_division_depot_api.php"
      );
      const data = await response.json();
      dispatch({ type: "GET_ZONE_AND_DIVISION_INFO_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "GET_ZONE_AND_DIVISION_INFO_ERROR" });
    }
  };

  const SetZoneAndDivision = (e, type = "") => {
    const value = e.target.value;
    if (type === "RAILWAY_ZONE") {
      dispatch({ type: "ZONE", payload: { value } });
    }
    if (type === "RAILWAY_DIVISION") {
      dispatch({ type: "DIVISION", payload: { value } });
    }

    if (type === "RAILWAY_DEPOT") {
      dispatch({ type: "DEPOT", payload: { value } });
    }
  };
  useEffect(() => {
    zoneAndDivisionInfoToFetch();
  }, []);
  return (
    <InitialContext.Provider
      value={{
        ...state,
        zoneAndDivisionInfoToFetch,
        SetZoneAndDivision,
      }}
    >
      {children}
    </InitialContext.Provider>
  );
};

export const useInitialContext = () => {
  return useContext(InitialContext);
};
