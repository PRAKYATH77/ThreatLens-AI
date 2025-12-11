// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
// If you haven't created config/db.js, use the inline connection logic from previous steps.
// Otherwise, keep this line:
const connectDB = require("./config/db"); 
// OR use the inline mongoose.connect if you don't have the config file:
// const mongoose = require('mongoose'); 

// --- Import Routes & Middleware ---
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const userActionsRoutes = require("./routes/userActionsRoutes");
const scanRoutes = require("./routes/scanRoutes"); // <-- NEW: Phase 4 Import
const alertRoutes = require("./routes/alertRoutes"); // <-- NEW: Alerts Route
const testRoutes = require("./routes/testRoutes"); // <-- NEW: Testing Routes for Alert Generation
const simulationRoutes = require("./routes/simulationRoutes"); // <-- NEW: Simulation Routes
const threatDetector = require("./middleware/threatDetector");

const app = express();
const server = http.createServer(app); 

// Determine allowed frontend origins
const FRONTEND_DEFAULT = process.env.FRONTEND_URL || "http://localhost:5173";
const ALLOWED_ORIGINS = [FRONTEND_DEFAULT, "http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:3000", "http://localhost:3000"];

// --- Initialize Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('CORS origin not allowed'), false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("socketio", io);

// --- Middleware ---
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('CORS origin not allowed'), false);
    },
    credentials: true,
  })
);
app.use(cookieParser(process.env.JWT_SECRET));

// 🛡️ ACTIVE THREAT DETECTION (Runs on ALL incoming requests)
app.use(threatDetector);

// --- Routes ---
// Note: We add '/api' prefix to match the frontend axios BaseURL
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/actions", userActionsRoutes);
app.use("/api/scan", scanRoutes); // <-- NEW: Phase 4 Route
app.use("/api/alerts", alertRoutes); // <-- NEW: Alerts Route
app.use("/api/test", testRoutes); // <-- NEW: Testing Routes for Alert Generation
app.use("/api/simulate", simulationRoutes); // <-- NEW: Simulation Routes

const PORT = process.env.PORT || 5000;

// Database connection logic (Inline fallback if config/db.js is missing)
const start = async () => {
  try {
    // If using require('./config/db'), ensure that file exports a function:
    // await connectDB(); 
    
    // OR Standard Mongoose Connect (Recommended if you followed previous steps):
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("🛡 MongoDB Connected Successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Startup Error:", error);
  }
};

start();