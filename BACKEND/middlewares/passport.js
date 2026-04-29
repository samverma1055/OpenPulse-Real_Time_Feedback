import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userModel.js";

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) return done(null, false, { message: "Invalid email or password" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: "Invalid email or password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize: store user id in session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize: retrieve full user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;