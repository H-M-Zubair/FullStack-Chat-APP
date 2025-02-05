import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; //Returning SocketId of the User
}

//  to store user socket connections(Online Users)
const userSocketMap = {}; //Through it we'll store {userId:socketId}(userId comme from DB and socket id auto generated)
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  const UserId = socket.handshake.query.userId;
  if (UserId) userSocketMap[UserId] = socket.id; //Mapping UserId{userId:socketId}
  //io.emit is used for Broadcasting ,To send Events to all the connected(Online) Clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    if (UserId) delete userSocketMap[UserId]; //Removing UserId{userId:socketId} from mapping
  });
});

export { server, app, io };
