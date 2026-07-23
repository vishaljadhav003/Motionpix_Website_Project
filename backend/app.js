const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// SOCKET GLOBAL
app.set("io", io);
app.set("trust proxy", 1);

// ✅ SESSION (ONLY ONCE)
app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // production मध्ये true
    },
  })
);

// ✅ CACHE FIX
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// CORS
app.use(cors({
    origin(origin, callback) {

        if (!origin) return callback(null, true);

        if (/^http:\/\/localhost:\d+$/.test(origin)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },

    credentials: true
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// ROUTES
const contactRoutes = require("./routes/contactRoutes");
const careerRoutes = require("./routes/careerRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
app.use("/api", visitorRoutes);
app.use("/api", contactRoutes);
app.use("/api", careerRoutes);

// HOME
app.get("/", (req, res) => {
  res.redirect("/api/admin");
});

// SOCKET
io.on("connection", (socket) => {
  console.log("🟢 Admin Connected");

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected");
  });
});

// START
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});