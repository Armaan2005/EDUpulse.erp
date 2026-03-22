import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinMeeting = ({ role }) => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // STAFF: Create meeting
  const handleCreateMeeting = async () => {
    try {
      setError("");
      setStatusText("Creating meeting...");

      const res = await axios.post(
        "http://localhost:7000/api/meeting/create"
      );

      setGeneratedCode(res.data.meetingCode);
      setRoomId(res.data.roomId);
      setStatusText("Meeting created. Share code with student.");
    } catch (err) {
      setError("Failed to create meeting.");
      setStatusText("");
    }
  };

  // JOIN: Works for both staff and student
  const handleJoinMeeting = async () => {
    try {
      setError("");
      setStatusText("Joining meeting...");

      const res = await axios.post(
        "http://localhost:7000/api/meeting/join",
        { meetingCode: joinCode }
      );

      navigate(`/ptm/${res.data.roomId}`);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Invalid or expired meeting code"
      );
      setStatusText("");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>PTM Meeting Portal</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {statusText && <p style={{ color: "blue" }}>{statusText}</p>}

      {/* STAFF CREATE */}
      {role === "staff" && (
        <div style={{ marginBottom: "40px" }}>
          <h3>Create Meeting</h3>

          <button onClick={handleCreateMeeting}>
            Generate Meeting Code
          </button>

          {generatedCode && (
            <div style={{ marginTop: "20px" }}>
              <h1>{generatedCode}</h1>

              <button onClick={copyCode}>Copy Code</button>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => navigate(`/ptm/${roomId}`)}
              >
                Enter Room Directly
              </button>
            </div>
          )}
        </div>
      )}

      {/* JOIN SECTION – visible to both */}
      <div>
        <h3>Join Meeting</h3>

        <input
          type="text"
          value={joinCode}
          placeholder="Enter meeting code"
          onChange={(e) =>
            setJoinCode(e.target.value.toUpperCase())
          }
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={handleJoinMeeting}
          disabled={!joinCode}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinMeeting;