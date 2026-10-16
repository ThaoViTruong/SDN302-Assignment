
const express = require("express");

const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");

const {
    verifyUser,
    verifyAuthor
} = require("../middleware/authenticate");

const router = express.Router();

// GET: Mọi người đều có thể xem danh sách câu hỏi
router.get("/", getQuestions);

// GET: Mọi người đều có thể xem chi tiết câu hỏi
router.get("/:questionId", getQuestionById);

// POST: Phải đăng nhập mới được tạo câu hỏi
router.post("/", verifyUser, createQuestion);

// PUT: Phải đăng nhập và là tác giả của câu hỏi
router.put("/:questionId", verifyUser, verifyAuthor, updateQuestion);

// DELETE: Phải đăng nhập và là tác giả của câu hỏi
router.delete("/:questionId", verifyUser, verifyAuthor, deleteQuestion);

module.exports = router;
