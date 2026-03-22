import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPtmSocket } from "../ptmSocket.js";

const STUN_SERVER = "stun:stun.l.google.com:19302";

const PTMMeeting = () => {
  const { meetingId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fallback logic because useAuth is not defined in the project
    const isStaff = localStorage.getItem("emtoken");
    const uid = Math.random().toString(36).substring(7);
    setUser({
      id: uid,
      role: isStaff ? "staff" : "student"
    });
  }, []);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const [status, setStatus] = useState("Initializing...");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const socket = getPtmSocket();
    let pendingIceCandidates = [];

    const createPeerConnection = () => {
      if (pcRef.current) return;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: STUN_SERVER }]
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice-candidate", {
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
          setStatus("Connecting...");
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);

          socket.emit("webrtc-offer", {
            meetingId,
            offer,
            fromUserId: user.id
          });
        } else {
          setStatus("Waiting to join...");
        }

      } catch (err) {
        console.error("Media device error:", err);
        setStatus("Camera/Microphone permission denied");
      }
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

      socket.emit("webrtc-answer", {
        meetingId,
        answer,
        fromUserId: user.id
      });

      setStatus("Connected");
    };

    const handleAnswer = async ({ answer, fromUserId }) => {
      if (fromUserId === user.id || !pcRef.current) return;

      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      await processIceQueue();
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
      } catch (err) {
        console.error("ICE error:", err);
      }
    };

    // Clean up before re-registering just in case of strict mode
    socket.off("webrtc-offer");
    socket.off("webrtc-answer");
    socket.off("webrtc-ice-candidate");

    socket.on("webrtc-offer", handleOffer);
    socket.on("webrtc-answer", handleAnswer);
    socket.on("webrtc-ice-candidate", handleIceCandidate);

    socket.emit("join-meeting-room", { meetingId });

    startLocalStream();

    return () => {
      socket.off("webrtc-offer", handleOffer);
      socket.off("webrtc-answer", handleAnswer);
      socket.off("webrtc-ice-candidate", handleIceCandidate);

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
        socket.emit("ptm:leave", { meetingId, userId: user.id });
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