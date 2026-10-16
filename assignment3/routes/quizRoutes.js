
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

const {
    verifyUser,
    verifyAdmin
} = require("../middleware/authenticate");

const router = express.Router();

// GET: Mọi người đều có thể xem danh sách Quiz
router.get("/", getQuizzes);

// GET: Mọi người đều có thể xem Quiz đã populate câu hỏi
router.get("/:quizId/populate", populateCapitalQuestions);

// GET: Mọi người đều có thể xem chi tiết Quiz
router.get("/:quizId", getQuizById);

// POST: Chỉ Admin được tạo Quiz
router.post("/", verifyUser, verifyAdmin, createQuiz);

// POST: Chỉ Admin được thêm một câu hỏi vào Quiz
router.post(
    "/:quizId/question",
    verifyUser,
    verifyAdmin,
    addQuestionToQuiz
);

// POST: Chỉ Admin được thêm nhiều câu hỏi vào Quiz
router.post(
    "/:quizId/questions",
    verifyUser,
    verifyAdmin,
    addManyQuestionsToQuiz
);

// PUT: Chỉ Admin được cập nhật Quiz
router.put("/:quizId", verifyUser, verifyAdmin, updateQuiz);

// DELETE: Chỉ Admin được xóa Quiz
router.delete("/:quizId", verifyUser, verifyAdmin, deleteQuiz);

module.exports = router;
