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

// GET all quizzes
router.get("/", getQuizzes);

router.get("/:quizId/populate", populateCapitalQuestions);
router.post("/:quizId/question", addQuestionToQuiz);
router.post("/:quizId/questions", addManyQuestionsToQuiz);

//CRUD
router.get("/:quizId", getQuizById);
router.post("/", createQuiz);
router.put("/:quizId", updateQuiz);
router.delete("/:quizId", deleteQuiz);

module.exports = router;