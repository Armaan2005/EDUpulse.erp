import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7000";

let socket = null;

export function getPtmSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });
  }
  return socket;
}

export function disconnectPtmSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}