import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import databaseConnection from "./database/dbConnection.js";
import feedbackRouter from "./routes/feedbackRoute.js";
import userAuthRouter from "./routes/userAuthRoute.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import sessionMiddleware from "./middlewares/session.js";

// ─── Load Environment Variables ───────────────────────────
dotenv.config({ path: "./config/config.env" });

// ─── Fix __dirname for ES Modules ─────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Static Path ──────────────────────────────────────────
export const staticPath = path.join(__dirname, "public");

// ─── Initialize Express App ───────────────────────────────
const app = express();

// ─── CORS (must be FIRST before routes) ──────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // needed for cookies/sessions to work cross-origin
  })
);

// ─── Built-in Middlewares ─────────────────────────────────
app.use(express.static(staticPath));             // Serve static files
app.use(cookieParser());                         // Parse cookies (must be before session)
app.use(express.json());                         // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// ─── Session Middleware ───────────────────────────────────
// Must come after cookieParser and before routes
app.use(sessionMiddleware);

// ─── Logger Middleware ────────────────────────────────────
app.use(logger);

// ─── API Routes ───────────────────────────────────────────
app.use("/api/v4/user", userAuthRouter);
app.use("/api/v4/feedback", feedbackRouter);

// ─── Error Handler (must be last!) ───────────────────────
app.use(errorHandler);

// ─── Connect to MongoDB ───────────────────────────────────
databaseConnection();

export default app;