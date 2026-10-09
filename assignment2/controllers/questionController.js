const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// GET /question
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({
            createdAt: -1
        });

        res.json(questions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET /question/:questionId
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// POST /question
const createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);

        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// PUT /question/:questionId
const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        question.text = req.body.text;
        question.options = req.body.options;
        question.keywords = req.body.keywords;
        question.correctAnswerIndex = req.body.correctAnswerIndex;

        await question.save();

        res.json(question);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE /question/:questionId
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(
            req.params.questionId
        );

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        await Quiz.updateMany(
            {
                questions: req.params.questionId
            },
            {
                $pull: {
                    questions: req.params.questionId
                }
            }
        );

        res.json({
            message: "Question deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
