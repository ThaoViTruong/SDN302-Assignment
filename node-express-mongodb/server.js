const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });