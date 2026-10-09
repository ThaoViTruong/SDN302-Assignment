
const express = require("express");

const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");

const router = express.Router();

// GET all questions
router.get("/", getQuestions);

// GET question by ID
router.get("/:questionId", getQuestionById);

// CREATE question
router.post("/", createQuestion);

// UPDATE question
router.put("/:questionId", updateQuestion);

// DELETE question
router.delete("/:questionId", deleteQuestion);

module.exports = router;