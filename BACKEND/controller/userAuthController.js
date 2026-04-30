import {
  registerService,
  loginService,
  getMyProfileService,
} from "../services/userAuthService.js";

// ─── REGISTER ─────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { token, user } = await registerService(req.body);
    res.status(201).json({ success: true, message: "Registered successfully!", token, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { token, user } = await loginService(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({ success: true, message: "Logged in successfully!", token, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ success: true, message: "Logged out successfully!" });
};

// ─── GET MY PROFILE ───────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    const user = await getMyProfileService(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};