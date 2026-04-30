import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import databaseConnection from "./database/dbConnection.js";
import feedbackRouter from "./routes/feedbackRoute.js";
import userAuthRouter from "./routes/userAuthRoute.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import passport from "./middlewares/passport.js";


dotenv.config({ path: "./config/config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const staticPath = path.join(__dirname, "public");

const app = express();

// ─── Middlewares ──────────────────────────────────────────
app.use(express.static(staticPath));
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4000"],
  credentials: true,    // ← allows cookies cross-origin
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session ──────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,        // ← must be false for localhost
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

// add these TWO lines after session middleware
app.use(passport.initialize());
app.use(passport.session());

// ─── Logger ───────────────────────────────────────────────
app.use(logger);

// ─── API Routes ───────────────────────────────────────────
app.use("/api/v4/user", userAuthRouter);
app.use("/api/v4/feedback", feedbackRouter);

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

databaseConnection();

export default app;