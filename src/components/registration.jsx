import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../Context/GlobalContextOne";
import { useNavigate } from "react-router-dom";

const ai = axios.create({
  baseURL: "https://railwaymcq.com/student/SignUp_api.php",
});

export default function Registration(props) {
  const [formData, setFormData] = useState({
    zone: "",
    division: "",
    deptt: "",
    name: "",
    userName: "",
    password: "",
    repassword: "",
    partener_flag: "0",
    ch_id: "",
  });
  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isPartener, setIsPartener] = useState(false);

  const navigate = useNavigate();
  const { departments, zone_division } = useGlobalContext();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (value === "") {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Please select a ${name}`,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }

    if (name === "userName") {
      if (/^[a-zA-Z]{6}$/.test(value)) {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get(
            `https://railwaymcq.com/student/checkUsernameAvailability.php?username=${value}`
          );
          setIsUsernameAvailable(response.data.isAvailable);
          setErrors((prevState) => ({
            ...prevState,
            userName: response.data.isAvailable
              ? ""
              : "Username is already taken",
          }));
        } catch (error) {
          console.error("Error checking username availability:", error);
        }
        setIsCheckingUsername(false);
      } else {
        setErrors((prevState) => ({
          ...prevState,
          userName: "Username must be HRMS ID",
        }));
        setIsUsernameAvailable(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "zone",
      "division",
      "deptt",
      "name",
      "userName",
      "password",
      "repassword",
    ];

    if (isPartener) {
      requiredFields.push("ch_id");
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrors((prevState) => ({
          ...prevState,
          [field]: `Please fill in the ${field} field`,
        }));
        return;
      }
    }

    if (formData.password !== formData.repassword) {
      setErrors((prevState) => ({
        ...prevState,
        repassword: "Passwords do not match",
      }));
      return;
    }

    try {
      if (
        Object.values(errors).some((error) => error !== "") ||
        !isUsernameAvailable
      ) {
        alert("Please fix the errors before submitting the form");
        return;
      }

      console.log("Form Data:", JSON.stringify(formData, null, 2));

      const response = await ai.post("/", formData);
      console.log("User added successfully:", response.data);

      alert("User added successfully");
      navigate("/Log&Reg");
      setFormData({
        zone: "",
        division: "",
        deptt: "",
        name: "",
        userName: "",
        password: "",
        repassword: "",
        partener_flag: "0",
        ch_id: "",
      });
      setIsPartener(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleIsNewPartener = (e) => {
    const { checked } = e.target;
    setIsPartener(checked);
    setFormData((prevState) => ({
      ...prevState,
      partener_flag: checked ? "1" : "0",
    }));
  };

  return (
    <div className="container" style={{ overflow: "hidden" }}>
      <form onSubmit={handleSubmit}>
        <h6>{props.heading}</h6>
        <label>
          <input
            type="checkbox"
            checked={isPartener}
            onChange={handleIsNewPartener}
          />
          Tick this to be a YouTube video Partner
        </label>
        {isPartener && (
          <input
            style={{ height: "35px" }}
            type="text"
            className="form-controll Subject"
            name="ch_id"
            value={formData.ch_id}
            onChange={handleChange}
            placeholder="Enter Your Channel ID"
            required={isPartener}
          />
        )}
        <div className="row">
          <div className="col-12 col-md-4">
            {" "}
            <select
              className="form-select form-select-sm Subject"
              name="zone"
              value={formData.zone}
              style={{ hwight: "40px", padding: "0px", paddingLeft: "5px" }}
              onChange={handleChange}
            >
              <option value=""> Zone</option>
              {zone_division?.map((zoneObject) =>
                Object.entries(zoneObject)?.map(([zone]) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))
              )}
            </select>
            {errors.zone && <p className="error">{errors.zone}</p>}
          </div>
          <div className="col-12 col-md-4">
            {" "}
            <select
              className="form-select form-select-sm Subject"
              name="division"
              value={formData.division}
              style={{ hwight: "40px", padding: "0px", paddingLeft: "5px" }}
              onChange={handleChange}
            >
              <option value=""> Division</option>
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
            {errors.division && <p className="error">{errors.division}</p>}
          </div>
          <div className="col-12 col-md-4">
            {" "}
            <select
              className="form-select form-select-sm Subject"
              name="deptt"
              value={formData.deptt}
              style={{ hwight: "40px", padding: "0px", paddingLeft: "5px" }}
              onChange={handleChange}
            >
              <option value="">Department</option>
              {departments?.map((depttObject) => (
                <option key={depttObject.deptt} value={depttObject.deptt}>
                  {depttObject.deptt}
                </option>
              ))}
            </select>
            {errors.deptt && <p className="error">{errors.deptt}</p>}
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6">
            <input
              style={{ height: "35px" }}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Please enter your name..."
              className="form-control Subject"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="col-12 col-md-6">
            {" "}
            <input
              type="text"
              style={{ height: "35px" }}
              className="form-control Subject"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {isCheckingUsername && <p>Checking username availability...</p>}
            {errors.userName && <p className="error">{errors.userName}</p>}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            {" "}
            <input
              style={{ height: "35px" }}
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter your password"
              className="form-control Subject"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="col-12 col-md-6">
            <input
              style={{ height: "35px" }}
              type="password"
              value={formData.repassword}
              onChange={handleChange}
              name="repassword"
              placeholder="Re-enter your password"
              className="form-control Subject"
            />
            {errors.repassword && <p className="error">{errors.repassword}</p>}
          </div>
        </div>
        <div className="row ms-1 me-1 ">
          <button type="submit" className="btn  btn-outline-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
