const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const path = require("path");

dotenv.config();

const passport = require("./config/passport");
const connectDB = require("./db");
const User = require("./models/User");

const messageRoutes = require("./routes/MessageRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();

// ======================
// MIDDLEWARE
// ======================
// ✅ FIXED CORS (IMPORTANT FOR LOGIN SESSIONS)
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// STATIC FRONTEND FILES
// ======================
app.use(express.static(path.join(__dirname, "client")));

// ======================
// SESSION
// ======================
app.use(
session({
secret: process.env.SESSION_SECRET || "zecrets_secret",
resave: false,
saveUninitialized: false,
})
);

// ======================
// PASSPORT
// ======================
app.use(passport.initialize());
app.use(passport.session());

// ======================
// DB
// ======================
connectDB();

// ======================
// API ROUTES
// ======================
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ======================
// GOOGLE AUTH
// ======================
app.get(
"/auth/google",
passport.authenticate("google", {
scope: ["profile", "email"],
})
);

app.get(
"/auth/google/callback",
passport.authenticate("google", {
failureRedirect: "/login.html",
}),
async (req, res) => {
try {
let user = await User.findOne({
email: req.user.email,
});

if (!user) {
  const username = req.user.email
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "");

  user = await User.create({
    username,
    email: req.user.email,
  });
}

res.redirect("/dashboard.html");
} catch (err) {
console.log(err);
res.send("Error creating user");
}
}
);

// ======================
// LOGOUT
// ======================
app.get("/logout", (req, res) => {
req.logout(() => {
res.redirect("/");
});
});

// ======================
// ROOT
// ======================
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "client", "index.html"));
});

// ======================
// USER INFO
// ======================
app.get("/me", (req, res) => {
if (req.user) {
res.json(req.user);
} else {
res.json({ message: "Not logged in" });
}
});

app.get("/session-check", (req, res) => {
res.json({
user: req.user,
session: req.session,
});
});
// ======================
// CLEAN USER ROUTE (/u/:username)
// ======================
app.get("/u/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "send-message.html"));
});

// ======================
// SERVER
// ======================
app.listen(5000, () => {
console.log("ZECRETS running on http://localhost:5000");
});
