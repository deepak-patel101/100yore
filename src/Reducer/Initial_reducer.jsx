import React from "react";

const initial_reducer = (state, action) => {
  // loading zone and division

  if (action.type === "GET_ZONE_AND_DIVISION_INFO_BEGIN") {
    return { ...state, zoneAndDivisionLoading: true };
  }
  if (action.type === "GET_ZONE_AND_DIVISION_INFO_SUCCESS") {
    // console.log("im fro globl context ", action.payload);
    const data = action.payload;

    return {
      ...state,
      zoneAndDivisionLoading: false,
      zoneAndDivisionData: data, // to insert data in mast_info []
    };
  }
  if (action.type === "GET_ZONE_AND_DIVISION_INFO_ERROR") {
    return {
      ...state,
      zoneAndDivisionLoading: false,
      zoneAndDivisionError: true,
    };
  }

  if (action.type === "ZONE") {
    const ZONE = action.payload.value;

    return {
      ...state,
      railwayInfo: {
        ...state.railwayInfo,
        railway_zone: ZONE,
      },
    };
  }
  if (action.type === "DIVISION") {
    const DIVISION = action.payload.value;
    return {
      ...state,
      railwayInfo: { ...state.railwayInfo, railway_division: DIVISION },
    };
  }
  if (action.type === "DEPOT") {
    const DEPOT = action.payload.value;
    return {
      ...state,
      railwayInfo: { ...state.railwayInfo, railway_depot: DEPOT },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};
export default initial_reducer;
