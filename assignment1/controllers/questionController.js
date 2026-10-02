const Question = require("../models/Question");

// GET /question
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();

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
        const question = await Question.findByIdAndUpdate(
            req.params.questionId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

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