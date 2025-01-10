import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReplyFrom from "./ReplyFrom"; // Ensure the path is correct
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReplies, setShowReplies] = useState(false);

  const fetchThread = () => {
    axios
      .get(
        `https://railwaymcq.com/railwaymcq/RailPariksha/post_thread_api.php?id=${id}`
      )
      .then((response) => {
        setThread(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the thread!", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div>
      {thread && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{thread.title}</Card.Title>
            <Card.Text>{thread.content}</Card.Text>
            <Button onClick={handleShowReplies} className="mb-3">
              {showReplies ? "Hide Replies" : "Show Replies"}
            </Button>
            {showReplies && (
              <div>
                {thread.replies.map((reply) => (
                  <Card key={reply.id} className="mb-2">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <strong className="me-2">{reply.uname}:</strong>
                        <Card.Text className="mb-0">{reply.content}</Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
            <ReplyFrom threadId={thread.id} onReplyPosted={fetchThread} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default ThreadDetail;
