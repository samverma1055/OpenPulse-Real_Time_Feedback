import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

// ─── Create HTTP Server from Express App ──────────────────
const httpServer = createServer(app);

// ─── Attach Socket.io to HTTP Server ──────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// ─── Make `io` accessible anywhere via req.app.get("io") ──
app.set("io", io);

// ─── Socket.io Connection Lifecycle ───────────────────────
io.on("connection", (socket) => {
  console.log(`⚡ New client connected → Socket ID: ${socket.id}`);

  // Client can join a "feedback" room to get targeted events
  socket.on("joinFeedbackRoom", () => {
    socket.join("feedbackRoom");
    console.log(`📌 Socket ${socket.id} joined feedbackRoom`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected → Socket ID: ${socket.id}`);
  });
});

// ─── Export io for use in other files if needed ───────────
export { io };

// ─── Start Server ─────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`🚀 OpenPulse Server running at http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.io is active and listening`);
});

// ─── Handle Unhandled Promise Rejections ──────────────────
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => {
    process.exit(1);
  });
});