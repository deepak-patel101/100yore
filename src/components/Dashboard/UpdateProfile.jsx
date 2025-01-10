import React, { useState } from "react";
import { useUserContext } from "../../Context/UserContext";
import { useGlobalContext } from "../../Context/GlobalContextOne";

const UpdateProfile = () => {
  const { user, updateUserData } = useUserContext();
  const { departments, zone_division } = useGlobalContext();

  const [formData, setFormData] = useState({
    zone: user.zone || "",
    division: user.division || "",
    deptt: user.deptt || "",
    name: user.name || "",
    login_type: user.login_type || "",
    CH_ID: user.CH_ID || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData =
      formData.CH_ID === "" ? { ...formData, login_type: "user" } : formData;

    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/BecomeVideoPartner.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedFormData,
            id: user.id,
          }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        await refreshTheuserdata();
        alert(result.message);
      } else {
        alert(result.message || "Unable to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const refreshTheuserdata = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/refrshUserDATA.php?",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.id,
          }),
        }
      );
      const data = await response.json();
      if (data.success === true) {
        updateUserData(data.userData);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        New Zone
        <select
          className="form-select form-select-sm Subject"
          name="zone"
          value={formData.zone}
          onChange={handleChange}
        >
          <option value="">Zone</option>
          {zone_division?.map((zoneObject) =>
            Object.entries(zoneObject)?.map(([zone]) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))
          )}
        </select>
      </div>
      <div>
        New Division
        <select
          className="form-select form-select-sm Subject"
          name="division"
          value={formData.division}
          onChange={handleChange}
        >
          <option value="">Division</option>
          {zone_division?.map((zones) =>
            Object.entries(zones)?.map(([zone, divisions]) =>
              zone === formData.zone
                ? divisions?.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))
                : null
            )
          )}
        </select>
      </div>
      <div>
        New Department
        <input
          type="text"
          name="deptt"
          className="form-control Subject"
          value={formData.deptt}
          onChange={handleChange}
          placeholder="Department"
        />
      </div>
      <div>
        New Name
        <input
          type="text"
          className="form-control Subject"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
      </div>
      {user.CH_ID !== "" && (
        <div>
          New YouTube channel ID
          <input
            type="text"
            name="CH_ID"
            value={formData.CH_ID}
            className="form-control Subject"
            onChange={handleChange}
            placeholder="Channel ID (e.g., UCjVEpetUlrSopqlvoX_UOEA)"
          />
        </div>
      )}
      <button className="btn btn-outline-success" type="submit">
        Update Profile
      </button>
    </form>
  );
};

export default UpdateProfile;
