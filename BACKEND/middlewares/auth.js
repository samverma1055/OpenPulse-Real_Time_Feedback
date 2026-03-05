import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ─── IS AUTHENTICATED ─────────────────────────────────────
export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookie OR Authorization header
    const token =
      req.cookies.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id);

    next(); // ← Move to next middleware or controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ─── IS ADMIN ─────────────────────────────────────────────
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only!",
    });
  }
  next();
};