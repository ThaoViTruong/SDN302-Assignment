const Quiz = require("../models/Quiz");
const Question = require("../models/Question");


// GET /quizzes
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("questions");

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET /quizzes/:quizId
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// POST /quizzes
const createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);

        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// PUT /quizzes/:quizId
const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.quizId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json(quiz);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE /quizzes/:quizId
const deleteQuiz = async (req, res) => {
    try {
        // Tìm quiz trước để lấy danh sách question
        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        // Xóa tất cả question thuộc quiz
        await Question.deleteMany({
            _id: { $in: quiz.questions }
        });

        // Xóa quiz
        await Quiz.findByIdAndDelete(req.params.quizId);

        res.json({
            message: "Quiz and its questions deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET /quizzes/:quizId/populate
const populateCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId)
            .populate({
                path: "questions",
                match: {
                    text: {
                        $regex: "capital",
                        $options: "i"
                    }
                }
            });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// POST /quizzes/:quizId/question
const addQuestionToQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        const question = await Question.create(req.body);

        quiz.questions.push(question._id);

        await quiz.save();

        res.status(201).json({
            message: "Question added to quiz successfully",
            question,
            quiz
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// POST /quizzes/:quizId/questions
const addManyQuestionsToQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        const questions = await Question.insertMany(req.body);

        const questionIds = questions.map(
            question => question._id
        );

        quiz.questions.push(...questionIds);

        await quiz.save();

        res.status(201).json({
            message: "Questions added to quiz successfully",
            questions,
            quiz
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


module.exports = {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    populateCapitalQuestions,
    addQuestionToQuiz,
    addManyQuestionsToQuiz
};