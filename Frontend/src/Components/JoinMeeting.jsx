import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinMeeting = ({ role }) => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [joinCodeError, setJoinCodeError] = useState("");

  const navigate = useNavigate();

  const isJoining = statusText === "Joining meeting...";
  const isCreating = statusText === "Creating meeting...";

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

  const handleJoinMeeting = async () => {
    try {
      setError("");
      setStatusText("Joining meeting...");

      const res = await axios.post(
        "http://localhost:7000/api/meeting/join",
        { meetingCode: joinCode.trim() }
      );

      navigate(`/ptm/${res.data.roomId}`, { state: { role } });
    } catch (err) {
      setError(
        err.response?.data?.msg || "Invalid or expired meeting code"
      );
      setStatusText("");
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinCodeError("Please enter a meeting code.");
      return;
    }
    setJoinCodeError("");
    handleJoinMeeting();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-10 sm:px-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md border border-slate-100/80">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            PTM Meeting Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter a code to join your parent–teacher meeting
          </p>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}
        {statusText && !error && (
          <div
            className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900"
            role="status"
            aria-live="polite"
          >
            {statusText}
          </div>
        )}

        {/* STAFF CREATE */}
        {role === "staff" && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Create meeting
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Generate a code to share with students or parents.
            </p>

            <button
              type="button"
              onClick={handleCreateMeeting}
              disabled={isCreating}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Creating…" : "Generate meeting code"}
            </button>

            {generatedCode && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
                  Meeting code
                </p>
                <p className="text-2xl font-bold tracking-wider text-slate-900 font-mono break-all">
                  {generatedCode}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Copy code
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/ptm/${roomId}`, {
                        state: { role: "staff" },
                      })
                    }
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Enter room directly
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOIN SECTION – visible to both */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            Join with a code
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Use the code your teacher shared with you.
          </p>

          <form onSubmit={handleJoinSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="meeting-code-input"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Meeting code
              </label>
              <input
                id="meeting-code-input"
                type="text"
                name="meetingCode"
                value={joinCode}
                placeholder="e.g. ABC-123"
                autoComplete="off"
                aria-invalid={joinCodeError ? "true" : "false"}
                aria-describedby={
                  joinCodeError ? "meeting-code-error" : undefined
                }
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setJoinCodeError("");
                }}
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500"
                disabled={isJoining}
              />
              {joinCodeError && (
                <p
                  id="meeting-code-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {joinCodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isJoining}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isJoining ? "Joining…" : "Join"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting;