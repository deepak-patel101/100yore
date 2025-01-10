import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { FaUserTie } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { MdNearbyError } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useGlobalContext } from "../Context/GlobalContextOne";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [eyeOpen, setEyeOpen] = useState(false);

  const navigate = useNavigate();
  const { updateUserData } = useContext(UserContext);
  const { activePage } = useGlobalContext();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const response = await fetch(
        "https://railwaymcq.com/railwaymcq/RailPariksha/user_login_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (data.success) {
        if (data.user && data.token) {
          updateUserData(data.user);
          localStorage.setItem("sessionToken", data.token);

          // Verify the token in localStorage immediately

          navigate(
            activePage === "home"
              ? "/"
              : activePage === null
              ? "/"
              : `/${activePage}`
          );
        } else {
          setMsg("Login successful but token is missing");
        }
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMsg("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="m-1">
        <form onSubmit={handleLogin}>
          <div className="">
            <label>
              <FaUserTie /> UserName
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control Subject"
              placeholder="userName"
              style={{ backgroundColor: "white", height: "40px" }}
            />
          </div>
          <label className="mt-1">
            <RiLockPasswordFill /> Password
          </label>
          <div className="input-group ">
            <input
              type={eyeOpen ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control Subject"
              placeholder=" password"
              style={{ backgroundColor: "white", height: "40px" }}
            />
            <button
              className="btn btn-outline-secondary Subject me-1"
              type="button"
              style={{ height: "40px" }}
              onClick={() => setEyeOpen(!eyeOpen)}
            >
              {eyeOpen ? <IoMdEye /> : <IoEyeOff />}
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="row ms-1 me-1 mt-4">
            <button type="submit" className="btn btn-outline-success Subject">
              Login
            </button>
          </div>
          <div className="m-1">
            {loading && (
              <div className="d-flex justify-content-center">
                <div style={{ width: "200px" }} className="row progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{ width: "100%" }}
                    role="progressbar"
                    aria-label="Animated striped example"
                    aria-valuenow="100%"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            )}
            {msg && (
              <div style={{ color: "red" }}>
                <MdNearbyError /> {msg}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
