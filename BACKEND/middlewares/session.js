import session from "express-session";
import MongoStore from "connect-mongo";

// ─── Session Middleware ────────────────────────────────────
// Sessions are stored in MongoDB so they survive server restarts
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,   // used to sign the session ID cookie
  resave: false,                         // don't save session if nothing changed
  saveUninitialized: false,              // don't create session until data is stored
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,     // reuses your existing MongoDB
    ttl: 7 * 24 * 60 * 60,              // session expires in 7 days (in seconds)
    autoRemove: "native",                // MongoDB removes expired sessions itself
  }),
  cookie: {
    httpOnly: true,                      // JS in browser cannot read this cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days in milliseconds
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",                     // protects against CSRF
  },
  name: "openpulse.sid",                // custom cookie name (not default connect.sid)
});

export default sessionMiddleware;