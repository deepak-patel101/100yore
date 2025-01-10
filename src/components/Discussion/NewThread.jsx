import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Alert from "react-bootstrap/Alert";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { FaUser } from "react-icons/fa";

// Custom toolbar options
const modules = {
  toolbar: [
    [{ font: [] }], // Font style
    [{ size: ["small", false, "large", "huge"] }], // Font size
    [{ color: [] }, { background: [] }], // Font color and background color
    [{ align: [] }], // Text alignment
    ["bold", "italic", "underline", "strike"], // Text styles
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    ["clean"], // Remove formatting
  ],
};

const formats = [
  "font",
  "size",
  "color",
  "background",
  "align",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
];

function NewThread({ onThreadCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // ReactQuill handles HTML
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const { user } = useUserContext();
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleCrateThreadShow = () => {
    setShow(!show);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please Sign In to create a thread");
      navigate("/Log&Reg");
      return;
    }

    if (!content) {
      alert("Please insert content");
      return;
    }
    if (!selectedCategory || selectedCategory === "Discussion category") {
      alert("Please select a category");
      return;
    }

    axios
      .post(
        "https://railwaymcq.com/railwaymcq/RailPariksha/post_thread_api.php",
        {
          uid: user?.id,
          uname: user?.name,
          title,
          content, // Quill content is already formatted as HTML
          category: selectedCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setTitle("");
        setContent("");
        setError(null);
        onThreadCreated();
      })
      .catch((error) => {
        console.error("Error creating the thread!", error);
        setError(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="text-start">
      <h6>
        <FaUser />
        {user ? user?.name : "Guest user"}
      </h6>
      <div className="row position-relative">
        <hr />
        <div
          className="position-absolute"
          style={{
            left: "70%",
            top: "-17px",
            background: "White",
            maxWidth: "130px",
          }}
        >
          <div className="d-flex justify-content-center">
            {!show ? (
              <button
                onClick={handleCrateThreadShow}
                className="btn-sm btn btn-outline-dark"
              >
                New Post <FaAngleDoubleDown className="m-1" />
              </button>
            ) : (
              <button
                onClick={handleCrateThreadShow}
                className="btn-sm btn btn-outline-dark"
              >
                Post <FaAngleDoubleUp />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`p-2 ${show ? "show" : ""}`}>
        {show && (
          <div>
            {selectedCategory !== "Slogans" && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            )}

            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Enter your content here..."
              modules={modules}
              formats={formats}
              theme="snow"
            />
            <div className="d-flex justify-content-between mt-3">
              <div className="col-5">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-dark dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    {selectedCategory || "Category"}
                  </button>
                  <ul className="dropdown-menu">
                    {["Slogans", "Poems", "Other"].map((category) => (
                      <li key={category}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button className="btn btn-outline-dark col-5" type="submit">
                <IoIosCreate /> Upload
              </button>
            </div>
            {error && <Alert variant="danger">Error: {error}</Alert>}
          </div>
        )}
      </div>
    </form>
  );
}

export default NewThread;
