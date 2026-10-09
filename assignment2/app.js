const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars");
const ejs = require("ejs");
const connectDB = require("./config/db");

const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");

const quizApiRoutes = require("./routes/quizApiRoutes");
const questionApiRoutes = require("./routes/questionApiRoutes");

const app = express();

connectDB();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override
app.use(methodOverride("_method"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.successMessage = req.query.success || "";
    res.locals.currentTab = req.path.startsWith("/questions") ? "questions" : "quizzes";
    next();
});

// Template engines
app.engine(
    "handlebars",
    engine({
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "views", "layouts")
    })
);
app.engine("ejs", ejs.renderFile);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// API
app.use("/api/quizzes", quizApiRoutes);
app.use("/api/questions", questionApiRoutes);

// UI
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);

// Home
app.get("/", (req, res) => {
    res.redirect("/quizzes");
});

module.exports = app;
