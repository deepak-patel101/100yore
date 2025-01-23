import React, { useEffect, useState } from "react";

const ZoneDivisionDepotSelector = ({
  zoneAndDivision,
  setAccessRightsForUp,
  setEmptyDepot,
}) => {
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedDepots, setSelectedDepots] = useState([]);
  const [accessRights, setAccessRights] = useState([]);
  const [desig, setDesig] = useState([]);
  const [accessRightsName, setAccessRightsName] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownOpenDIVI, setDropdownOpenDIVI] = useState(false);
  const [isDropdownOpenDEPO, setDropdownOpenDEPO] = useState(false);

  useEffect(() => {
    setEmptyDepot([]);
    if (accessRightsName) {
      accessRightsName.forEach((zoneData) => {
        if (zoneData.depots_name.length === 0) {
          setEmptyDepot((prevEmptyDepot) => {
            // Add the zone_name only if it's not already in the array
            if (!prevEmptyDepot.includes(zoneData?.division_name)) {
              return [...prevEmptyDepot, zoneData?.division_name];
            }
            return prevEmptyDepot; // Return the same array if it's already present
          });
        }
      });
    }
  }, [accessRightsName]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const fetchDESGMaster = async () => {
    const desg_flag = true;

    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/gp_level.php?desg_flag=${desg_flag}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDesig(data);
    } catch (error) {
      console.error("Error fetching DESG_MASTER info:", error);
    }
  };
  useEffect(() => {
    fetchDESGMaster();
  }, []);
  const handleZoneChange = (zoneId) => {
    let updatedZones = [...selectedZones];
    if (zoneId === "all") {
      updatedZones =
        selectedZones.length === zoneAndDivision.length
          ? []
          : zoneAndDivision.map((zone) => zone.zone_id);
    } else {
      if (updatedZones.includes(zoneId)) {
        updatedZones = updatedZones.filter((id) => id !== zoneId);
      } else {
        updatedZones.push(zoneId);
      }
    }
    setSelectedZones(updatedZones);
    // setSelectedDivisions([]); // Reset divisions
    // setSelectedDepots([]); // Reset depots
  };

  const handleDivisionChange = (divisionId) => {
    let updatedDivisions = [...selectedDivisions];
    if (updatedDivisions.includes(divisionId)) {
      updatedDivisions = updatedDivisions.filter((id) => id !== divisionId);

      // Remove depots tied to this division
      const depotsToRemove = [];
      selectedZones.forEach((zoneId) => {
        const zone = zoneAndDivision.find((z) => z.zone_id === zoneId);
        const dynamicKey = Object.keys(zone).find((key) => key !== "zone_id");
        if (dynamicKey) {
          const division = zone[dynamicKey].find(
            (div) => div.division_id === divisionId
          );
          if (division) {
            depotsToRemove.push(
              ...division.depots.map((depot) => depot.depo_id)
            );
          }
        }
      });
      setSelectedDepots(
        selectedDepots.filter((depotId) => !depotsToRemove.includes(depotId))
      );
    } else {
      updatedDivisions.push(divisionId);
    }
    setSelectedDivisions(updatedDivisions);
  };

  const handleDepotChange = (depotId) => {
    let updatedDepots = [...selectedDepots];
    if (updatedDepots.includes(depotId)) {
      updatedDepots = updatedDepots.filter((id) => id !== depotId);
    } else {
      updatedDepots.push(depotId);
    }
    setSelectedDepots(updatedDepots);
  };

  const saveAccessRights = () => {
    const accessRightsData = [];
    const accessRightsNameData = [];

    selectedZones.forEach((zoneId) => {
      const zone = zoneAndDivision.find((z) => z.zone_id === zoneId);
      const dynamicKey = Object.keys(zone).find((key) => key !== "zone_id");
      if (dynamicKey) {
        const divisions = zone[dynamicKey].filter((division) =>
          selectedDivisions.includes(division.division_id)
        );
        divisions.forEach((division) => {
          const depots = division.depots.filter((depot) =>
            selectedDepots.includes(depot.depo_id)
          );

          accessRightsData.push({
            zones_id: zoneId,
            divisions_id: [division.division_id],
            depots_id: depots.map((depot) => depot.depo_id),
          });

          accessRightsNameData.push({
            zone_name: dynamicKey,
            division_name: division.division,
            depots_name: depots.map((depot) => depot.depot_name),
          });
        });
      }
    });

    setAccessRights(accessRightsData);
    setAccessRightsForUp(accessRightsData);
    setAccessRightsName(accessRightsNameData);
    alert("Access Rights Saved!");
    setDropdownOpen(false);
    setDropdownOpenDIVI(false);
    setDropdownOpenDEPO(false);
  };

  const divisionsAr = selectedZones
    .map((zoneId) => {
      const zone = zoneAndDivision.find((z) => z.zone_id === zoneId);
      const dynamicKey = Object.keys(zone).find((key) => key !== "zone_id");
      if (dynamicKey) return zone[dynamicKey] || [];
      return [];
    })
    .flat();

  const depotsAr = divisionsAr
    .filter((division) => selectedDivisions.includes(division.division_id))
    .flatMap((division) => division.depots);

  // Select all zones
  const selectAllZones = () => {
    setSelectedZones(zoneAndDivision?.map((zone) => zone.zone_id));
  };
  const unselectAllZones = () => {
    setSelectedZones([]);
    setSelectedDivisions([]);
    setSelectedDepots([]);
  };
  const unselectAllDivisions = () => {
    setSelectedDivisions([]);
    setSelectedDepots([]);
  };
  const unselectAllDepots = () => {
    setSelectedDepots([]);
  };

  // Select all divisions
  const selectAllDivisions = () => {
    setSelectedDivisions(divisionsAr?.map((division) => division.division_id));
  };

  // Select all depots
  const selectAllDepots = () => {
    setSelectedDepots(depotsAr?.map((depot) => depot.depo_id));
  };
  return (
    <div>
      <div className="row">
        <h5>Select Zones, Divisions, and Depots</h5>

        <div className="col-md-3">
          {/* Button to toggle the dropdown */}
          <div style={{ position: "relative" }}>
            <button
              className="Subject"
              onClick={toggleDropdown}
              style={{
                border: "1px solid #c5cfde",
                width: "100%",
                padding: "10px",
                background: "white",

                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Select Zones
            </button>

            {/* Dropdown content */}
            {isDropdownOpen && (
              <div className="papaDiv">
                <div className="d-flex justify-content-evenly">
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={selectAllZones}
                  >
                    select all
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={unselectAllZones}
                  >
                    clear all
                  </button>
                </div>
                <div
                  className="papaDiv text-start"
                  style={{
                    position: "absolute",
                    top: "100%",
                    padding: "10px",

                    left: 0,
                    right: 0,
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    zIndex: 1000,
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {zoneAndDivision &&
                    zoneAndDivision.map((zone) => {
                      const dynamicKey = Object.keys(zone).find(
                        (key) => key !== "zone_id"
                      );
                      return (
                        <div key={zone.zone_id}>
                          <input
                            type="checkbox"
                            checked={selectedZones.includes(zone.zone_id)}
                            onChange={() => handleZoneChange(zone.zone_id)}
                          />
                          <label style={{ marginLeft: "5px" }}>
                            {dynamicKey}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedZones.length > 0 && (
          <div className="col-md-3">
            <div style={{ position: "relative" }}>
              <button
                className="Subject"
                onClick={() => {
                  setDropdownOpenDIVI(!isDropdownOpenDIVI);
                }}
                style={{
                  border: "1px solid #c5cfde",
                  width: "100%",
                  padding: "10px",
                  background: "white",

                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Divisions
              </button>
              {isDropdownOpenDIVI && (
                <div className="papaDiv">
                  <div className="d-flex justify-content-evenly">
                    {" "}
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={selectAllDivisions}
                    >
                      select all
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={unselectAllDivisions}
                    >
                      clear all
                    </button>
                  </div>
                  <div
                    className="papaDiv text-start"
                    style={{
                      position: "absolute",
                      top: "100%",
                      padding: "10px",

                      left: 0,
                      right: 0,
                      maxHeight: "400px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      zIndex: 1000,
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {divisionsAr.map((division) => (
                      <div key={division.division_id}>
                        <input
                          type="checkbox"
                          checked={selectedDivisions.includes(
                            division.division_id
                          )}
                          onChange={() =>
                            handleDivisionChange(division.division_id)
                          }
                        />
                        <label>&nbsp;{division.division}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedDivisions.length > 0 && (
          <div className="col-md-4">
            <div style={{ position: "relative" }}>
              <button
                className="Subject"
                onClick={() => {
                  setDropdownOpenDEPO(!isDropdownOpenDEPO);
                }}
                style={{
                  border: "1px solid #c5cfde",
                  width: "100%",
                  padding: "10px",
                  background: "white",

                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Depots
              </button>
              {isDropdownOpenDEPO && (
                <div className="papaDiv">
                  <div className="d-flex justify-content-evenly ">
                    {" "}
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={selectAllDepots}
                    >
                      select all
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={unselectAllDepots}
                    >
                      clear all
                    </button>
                  </div>
                  <div
                    className="papaDiv text-start"
                    style={{
                      position: "absolute",
                      top: "100%",
                      padding: "10px",

                      left: 0,
                      right: 0,
                      maxHeight: "400px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      zIndex: 1000,
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {depotsAr.map((depot) => (
                      <div key={depot.depo_id}>
                        <input
                          type="checkbox"
                          checked={selectedDepots.includes(depot.depo_id)}
                          onChange={() => handleDepotChange(depot.depo_id)}
                        />
                        <label>
                          &nbsp; {depot.depot_name} ({depot.depot_fullname})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="col-md-2  ">
          <button
            className="Subject btn  btn-outline-success"
            onClick={saveAccessRights}
          >
            Save
          </button>
        </div>
      </div>{" "}
      {accessRightsName.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <h6>Access Rights :</h6>

          <table className="table text-start ">
            <thead>
              <tr>
                <th>SN</th>
                <th>Zone</th>
                <th>Division</th>
                <th>Depot</th>
              </tr>
            </thead>
            <tbody>
              {accessRightsName &&
                accessRightsName?.map((zoneData, index) => {
                  return (
                    <tr
                      key={index}
                      className={`
                    ${
                      zoneData.depots_name.length === 0
                        ? "table-danger"
                        : "table-success"
                    }`}
                    >
                      <td>{index + 1}</td>
                      <td>{zoneData?.zone_name}</td>
                      <td>{zoneData?.division_name}</td>

                      <td
                        className="d-flex flex-wrap"
                        style={{ whiteSpace: "normal", maxWidth: "80vw" }}
                      >
                        {zoneData.depots_name.length === 0
                          ? "-- EMPTY --"
                          : zoneData.depots_name?.map(
                              (depotName, ind) => depotName
                            )}{" "}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default ZoneDivisionDepotSelector;
