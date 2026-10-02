const express = require("express");

const {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    populateCapitalQuestions,
    addQuestionToQuiz,
    addManyQuestionsToQuiz
} = require("../controllers/quizController");

const router = express.Router();

router.get("/", getQuizzes);

router.post("/", createQuiz);

router.get("/:quizId/populate", populateCapitalQuestions);

router.post("/:quizId/question", addQuestionToQuiz);

router.post("/:quizId/questions", addManyQuestionsToQuiz);

router.get("/:quizId", getQuizById);

router.put("/:quizId", updateQuiz);

router.delete("/:quizId", deleteQuiz);

module.exports = router;