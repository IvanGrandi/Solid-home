require('mysql2');
const express = require("express");
const cors = require("cors");
require("./app/config/auth.config"); // Fails fast if JWT_SECRET is missing

// Import routes
const authRoutes = require("./app/routes/authRoutes");
const productRoutes = require("./app/routes/productRoutes");
const userRoutes = require("./app/routes/userRoutes"); // Import user routes

const setupDb = require("./setupDb");

const app = express();

// Vercel sits behind a proxy; trust it so the rate limiter sees the real client IP
if (process.env.VERCEL) {
  app.set("trust proxy", 1);
}

// Only the known frontends may call the API from a browser (override with CORS_ORIGINS, comma-separated)
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://localhost:4173,https://solid-home-nu.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim());

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/auth", authRoutes); // Routes for authentication
app.use("/api/products", productRoutes); // Product routes (adjusted path)
app.use("/api/users", userRoutes); // Use the routes with the base path "/api/users"

// Sync tables and seed on local runs only; on Vercel this would slow every cold start
if (!process.env.VERCEL) {
  setupDb().catch((err) => {
    console.error("Error setting up database:", err.message);
  });
}

// Test server route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home Decoration API!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
