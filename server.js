require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const connectDB = require("./config/dbConfig");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Enable CORS with specific origin and headers
// Enable CORS with specific origin and headers
const allowedOrigins = [
  "http://localhost:3000", // for local dev
  "https://autograder-client.vercel.app", // for production
  "http://autograder-client.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman) or whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Allow preflight OPTIONS requests to pass
app.options("*", cors());

// Connect to MongoDB
connectDB();

// Import routes from app.js
const setupApp = require("./app");
setupApp(app); // Pass the app instance to configure routes and middleware

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Flask API URL is: ${process.env.FLASK_API_URL}`);
});

// Test API Route
app.get("/", (req, res) => {
  res.send("Hello World, This is the Autograder Node.js server.");
});
