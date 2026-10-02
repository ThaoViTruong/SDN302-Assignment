const express = require("express");

const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");

const router = express.Router();

router.get("/", getQuestions);

router.get("/:questionId", getQuestionById);

router.post("/", createQuestion);

router.put("/:questionId", updateQuestion);

router.delete("/:questionId", deleteQuestion);

module.exports = router;