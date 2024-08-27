import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT!;
const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "GET"],
  },
});
io.on("connection", (socket) => {
  console.log("socket connected");
  console.log("socket.id", socket.id);
  io.emit("message", "hello", socket.id);
});
server.listen(PORT, () => {
  console.log("HTTP server started", PORT);
});
