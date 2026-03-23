const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("ptm-join-room", ({ meetingId, userId }) => {
      socket.join(meetingId);
      console.log(`${userId} joined room ${meetingId}`);
      socket.to(meetingId).emit("student-joined", { meetingId, userId });
    });

    socket.on("ptm-offer", ({ meetingId, offer, fromUserId }) => {
      socket.to(meetingId).emit("ptm-offer", {
        offer,
        fromUserId,
      });
    });

    socket.on("ptm-answer", ({ meetingId, answer, fromUserId }) => {
      socket.to(meetingId).emit("ptm-answer", {
        answer,
        fromUserId,
      });
    });

    socket.on("ptm-ice-candidate", ({ meetingId, candidate, fromUserId }) => {
      socket.to(meetingId).emit("ptm-ice-candidate", {
        candidate,
        fromUserId,
      });
    });

    socket.on("ptm-leave-room", ({ meetingId, userId }) => {
      socket.leave(meetingId);
      socket.to(meetingId).emit("peer-left", { meetingId, userId });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = { initSocket };

