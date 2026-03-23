import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getPtmSocket } from "../ptmSocket.js";

const STUN_SERVER = "stun:stun.l.google.com:19302";

const PTMMeeting = () => {
  const { roomId } = useParams();
  const meetingId = roomId;
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roleFromNav = location.state?.role;
    const cookie = typeof document !== "undefined" ? document.cookie : "";
    const hasStaffToken = cookie.includes("emstoken=") || localStorage.getItem("emstoken");
    const hasStudentToken = cookie.includes("emtoken=") || localStorage.getItem("emtoken");
    const isStaff = roleFromNav === "staff" || (!roleFromNav && hasStaffToken && !hasStudentToken);
    const uid = Math.random().toString(36).substring(7);
    setUser({
      id: uid,
      role: isStaff ? "staff" : "student"
    });
  }, [location.state]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const [status, setStatus] = useState("Initializing...");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    if (!meetingId) {
      setStatus("Meeting expired or invalid room");
      return;
    }

    const socket = getPtmSocket();
    let pendingIceCandidates = [];

    const createPeerConnection = () => {
      if (pcRef.current) return;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: STUN_SERVER }]
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("[PTM] ICE candidate sent");
          socket.emit("ptm-ice-candidate", {
            meetingId,
            candidate: event.candidate,
            fromUserId: user.id
          });
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pcRef.current = pc;
    };

    const processIceQueue = async () => {
      for (const candidate of pendingIceCandidates) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Queued ICE error:", err);
        }
      }
      pendingIceCandidates = [];
    };

    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        createPeerConnection();

        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });

        if (user.role === "staff" || user.role === "admin") {
          setStatus("Waiting for student to join...");
        } else {
          setStatus("Joining room...");
        }
        return true;

      } catch (err) {
        console.error("Media device error:", err);
        setStatus("Camera/Microphone permission denied");
        return false;
      }
    };

    const createAndSendOffer = async () => {
      if (!pcRef.current || !localStreamRef.current) return;
      console.log("[PTM] Creating offer");
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit("ptm-offer", {
        meetingId,
        offer,
        fromUserId: user.id
      });
      setStatus("Connecting...");
    };

    const handleOffer = async ({ offer, fromUserId }) => {
      if (fromUserId === user.id) return;
      
      createPeerConnection();
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      await processIceQueue();

      if (localStreamRef.current) {
        const senders = pcRef.current.getSenders();
        localStreamRef.current.getTracks().forEach((track) => {
          if (!senders.find(s => s.track === track)) {
            pcRef.current.addTrack(track, localStreamRef.current);
          }
        });
      }

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("ptm-answer", {
        meetingId,
        answer,
        fromUserId: user.id
      });

      console.log("[PTM] Answer sent");
      setStatus("Connected");
    };

    const handleAnswer = async ({ answer, fromUserId }) => {
      if (fromUserId === user.id || !pcRef.current) return;

      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      await processIceQueue();
      console.log("[PTM] Answer received");
      setStatus("Connected");
    };

    const handleIceCandidate = async ({ candidate, fromUserId }) => {
      if (fromUserId === user.id) return;
      
      createPeerConnection();

      try {
        const rtcCandidate = new RTCIceCandidate(candidate);
        if (pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
          await pcRef.current.addIceCandidate(rtcCandidate);
        } else {
          pendingIceCandidates.push(rtcCandidate);
        }
        console.log("[PTM] ICE candidate received");
      } catch (err) {
        console.error("ICE error:", err);
      }
    };

    const handleStudentJoined = async ({ userId: joinedUserId }) => {
      if (joinedUserId === user.id) return;
      console.log("[PTM] Student joined room");
      if (user.role === "staff" || user.role === "admin") {
        await createAndSendOffer();
      }
    };

    // Clean up before re-registering just in case of strict mode
    socket.off("ptm-offer");
    socket.off("ptm-answer");
    socket.off("ptm-ice-candidate");
    socket.off("student-joined");

    socket.on("ptm-offer", handleOffer);
    socket.on("ptm-answer", handleAnswer);
    socket.on("ptm-ice-candidate", handleIceCandidate);
    socket.on("student-joined", handleStudentJoined);

    startLocalStream().then((ok) => {
      if (!ok) return;
      console.log("[PTM] Joining room", meetingId);
      socket.emit("ptm-join-room", { meetingId, userId: user.id });
    });

    return () => {
      socket.off("ptm-offer", handleOffer);
      socket.off("ptm-answer", handleAnswer);
      socket.off("ptm-ice-candidate", handleIceCandidate);
      socket.off("student-joined", handleStudentJoined);

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [meetingId, user?.id, user?.role]);

  const toggleMute = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = isAudioMuted;
    });

    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff;
    });

    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    try {
      if (user?.id) {
        const socket = getPtmSocket();
        socket.emit("ptm-leave-room", { meetingId, userId: user.id });
      }
    } catch(err) {
      console.error("Error leaving gracefully:", err);
    }

    navigate("/dashboard");
  };

  return (
    <div className="ptm-container">
      {status === "Connecting..." && (
        <div className="status-overlay">
          <h2>Connecting to teacher...</h2>
        </div>
      )}
      {status === "Waiting to join..." && (
        <div className="status-overlay">
          <h2>Waiting to join...</h2>
        </div>
      )}
      {status === "Connected" && (
        <div className="status-overlay" style={{ top: '20px' }}>
          <h2>PTM Live</h2>
        </div>
      )}

      <div className="video-stage">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="remote-video"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="local-video"
        />
      </div>

      <div className="ptm-controls">
        <button
          onClick={toggleMute}
          title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
          aria-label={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
          className="control-btn"
        >
          {isAudioMuted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={toggleVideo}
          title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
          aria-label={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
          className="control-btn"
        >
          {isVideoOff ? "Camera On" : "Camera Off"}
        </button>

        <button
          onClick={endCall}
          title="End Call"
          aria-label="End Call"
          className="end"
        >
          End Call
        </button>
      </div>

      <style>{`
        .ptm-container {
          min-height: 100vh;
          background-color: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: inherit;
        }

        .status-overlay {
          position: absolute;
          color: white;
          z-index: 10;
          text-align: center;
        }

        .video-stage {
          position: relative;
          width: 90%;
          max-width: 1200px;
          height: 80vh;
          background-color: #000;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .remote-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 16px;
        }

        .local-video {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 220px;
          height: 150px;
          border-radius: 12px;
          border: 2px solid white;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 5;
          transform: scaleX(-1);
        }

        .ptm-controls {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          z-index: 20;
          background: rgba(15, 23, 42, 0.8);
          padding: 16px 32px;
          border-radius: 40px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .control-btn {
          padding: 12px 24px;
          background: #334155;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          outline: none;
          transition: background 0.2s ease;
        }

        .control-btn:hover {
          background: #475569;
        }

        .control-btn:focus-visible {
          outline: 2px solid #38bdf8;
          outline-offset: 2px;
        }

        .end {
          padding: 12px 24px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          outline: none;
          transition: background 0.2s ease;
        }

        .end:hover {
          background: #dc2626;
        }

        .end:focus-visible {
          outline: 2px solid #38bdf8;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default PTMMeeting;