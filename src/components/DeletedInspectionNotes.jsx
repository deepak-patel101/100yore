import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/css/Recycle.css";

import { useLocation } from "react-router-dom";
import GoBackCom from "./GoBackCom";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaRedo } from "react-icons/fa";

const DeletedInspectionNotes = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);

  useEffect(() => {
    fetchDeletedNotes();
  }, []);
  const location = useLocation();
  const { state: receivedData } = location;
  const fetchDeletedNotes = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/deleted-inspection-notes.php",
        {
          params: { userid: receivedData?.userid },
        }
      );
      console.log("loginid:::::", receivedData?.userid);
      setDeletedNotes(response.data);
    } catch (error) {
      console.error("Error fetching deleted notes", error);
    }
  };
  const restoreNote = async (id) => {
    try {
      await axios.post(
        "https://railwaymcq.com/student/deleted-inspection-notes.php",
        {
          id,
          action: "restore",
        }
      );
      fetchDeletedNotes();
    } catch (error) {
      console.error("Error restoring note", error);
    }
  };

  const permanentlyDeleteNote = async (id) => {
    try {
      await axios.delete(
        "https://railwaymcq.com/student/deleted-inspection-notes.php",
        {
          data: { id },
        }
      );
      fetchDeletedNotes();
    } catch (error) {
      console.error("Error permanently deleting note", error);
    }
  };

  return (
    <div className="container  ">
      <GoBackCom link={"/Add-Notes"} page={"Deleted Notes"} />
      <div className="papaDiv">
        {" "}
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr className="table-dark">
              <th style={{ width: "10vw" }}>ID</th>
              <th style={{ width: "60vw" }}>Note</th>
              <th style={{ width: "20vw" }}>Deleted On</th>
              <th style={{ width: "10vw" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deletedNotes.map((note) => (
              <tr key={note.noteid}>
                <td>{note.noteid}</td>
                {/* <td>{note.note}</td> */}
                <td>
                  {" "}
                  <div dangerouslySetInnerHTML={{ __html: note.note }} />
                </td>
                <td>{note.deleted_on}</td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm me-1"
                    onClick={() => restoreNote(note.noteid)}
                  >
                    <FaRedo />
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm ms-1"
                    onClick={() => permanentlyDeleteNote(note.noteid)}
                  >
                    <RiDeleteBin6Fill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeletedInspectionNotes;
