import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

// ─── Create HTTP server from Express app ─────────────────
const httpServer = createServer(app);

// ─── Attach Socket.io to HTTP server ─────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ─── Socket.io Events ────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  // Client joins the feedback room
  socket.on("join_feedback", () => {
    socket.join("feedback_room");
    console.log(`📡 ${socket.id} joined feedback_room`);
  });

  // Client disconnects
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ─── Export io so controllers can use it ─────────────────
export { io };

// ─── Start Server ─────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`🚀 OpenPulse Server running at http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`⚡ Socket.io ready!`);
});

// ─── Handle Crashes ───────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});