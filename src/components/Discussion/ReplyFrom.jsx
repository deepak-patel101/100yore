import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../../Context/UserContext";

function ReplyFrom({ threadId, onReplyPosted }) {
  const [content, setContent] = useState("");
  const { user } = useUserContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        "https://railwaymcq.com/railwaymcq/RailPariksha/post_reply_api.php",
        {
          uid: user?.id,
          uname: user?.name,
          threadId,
          content,
        }
      )
      .then((response) => {
        const newReply = response.data;
        onReplyPosted(newReply);
        setContent("");
      })
      .catch((error) => {
        console.error("There was an error posting the reply!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="Please reply me......."
      />
      <button className="btn btn-success" type="submit">
        Reply
      </button>
    </form>
  );
}

export default ReplyFrom;
