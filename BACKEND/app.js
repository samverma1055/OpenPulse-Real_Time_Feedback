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

// ─── Load Environment Variables ───────────────────────────
dotenv.config({ path: "./config/config.env" });

// ─── Fix __dirname for ES Modules ─────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Static Path ──────────────────────────────────────────
export const staticPath = path.join(__dirname, "public");

// ─── Initialize Express App ───────────────────────────────
const app = express();

// ─── Built-in Middlewares ─────────────────────────────────
app.use(express.static(staticPath));   // Serve static files
app.use(cors());                        // Allow cross-origin requests
app.use(cookieParser());               // Parse cookies
app.use(express.json());               // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse form data
// ─── Logger Middleware ────────────────────────────────────
app.use(logger);
// ─── API Routes ───────────────────────────────────────────
app.use("/api/v4/user", userAuthRouter);
app.use("/api/v4/feedback", feedbackRouter);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// ─── Error Handler (must be last!) ───────────────────────
app.use(errorHandler);
// ─── Connect Database ─────────────────────────────────────
databaseConnection();

export default app;