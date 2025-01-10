import React, { useState } from "react";
import { useUserContext } from "../../Context/UserContext";
const BeComeVideoPartner = () => {
  const { user, updateUserData } = useUserContext();

  console.log(user);
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

    if (name === "CH_ID") {
      // Update the CH_ID field and set login_type if CH_ID changes
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        login_type: value ? "partener" : prevFormData.login_type,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/BecomeVideoPartner.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            id: user.id,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      console.log(formData, user.id);
      if (response.ok) {
        alert(result.message);
        if (result.status === "success") {
          await refreshTheuserdata();
          alert(result.message);
        } else {
          alert(result.message || "Unable to update profile.");
        }
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="login_type"
          style={{ display: "none" }}
          value={formData.login_type}
          onChange={handleChange}
          placeholder="Login Type"
        />
        insert your YouTube channel ID
        <input
          type="text"
          name="CH_ID"
          value={formData.CH_ID}
          className="form-control Subject"
          onChange={handleChange}
          placeholder="channel id ex = UCjVEpetUlrSopqlvoX_UOEA"
        />
        <button className="btn btn-outline-success" type="submit">
          {" "}
          Becme a YouTube partner{" "}
        </button>
      </form>
      <div style={{ fontSize: "12px" }}>
        note: please sign-in again after ading thae channel id
      </div>
    </div>
  );
};
export default BeComeVideoPartner;
