require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const connectDB = require("./config/dbConfig");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Enable CORS with specific origin and headers
app.use(
  cors({
    origin: "*", // Change "*" to specific frontend URL for security (e.g., "http://localhost:3000")
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
