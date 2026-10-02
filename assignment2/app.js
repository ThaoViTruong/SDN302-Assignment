const express = require("express");

const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/quizzes", quizRoutes);
app.use("/question", questionRoutes);

// Home page
app.get("/", (req, res) => {
    res.json({
        message: "Assignment 1 is running"
    });
});

// Return JSON for unknown API routes instead of Express HTML.
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.status || error.statusCode || 500;

    res.status(statusCode).json({
        message: error.message || "Internal server error"
    });
});

module.exports = app;
